import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import cloudinary from "@/lib/cloudinary";
import { Readable } from "stream";
import sendgrid from "@sendgrid/client";

sendgrid.setApiKey(process.env.SENDGRID_API_KEY!);

async function sendNotificationEmail(post: {
  title: string;
  slug: string;
  body: string;
  imageUrl?: string;
}) {
  const postUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/posts/${post.slug}`;
  const excerpt = post.body.substring(0, 150) + "...";

  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000; 
  const istDate = new Date(now.getTime() + istOffset);
  
  const sendAtIST = istDate.toISOString().replace('Z', '+05:30');

  //customize email here
  const html_content = `
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
      ${
        post.imageUrl
          ? `<a href="${postUrl}"><img src="${post.imageUrl}" alt="${post.title}" style="width: 100%; height: auto;"/></a>`
          : ''
      }
      <div style="padding: 24px;">
        <h1 style="font-size: 24px; margin-top: 0;">${post.title}</h1>
        <p style="font-size: 16px; color: #555;">${excerpt}</p>
        <a href="${postUrl}" style="display: inline-block; padding: 12px 20px; background-color: #13aa52; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold;">
          Read More
        </a>
      </div>
      <footer style="background-color: #f7f7f7; padding: 16px; text-align: center; font-size: 12px; color: #888;">
        <p>You are receiving this because you subscribed to my blog.</p>
      </footer>
    </div>
  `;

  // create a single send
  const singleSendData = {
    name: `New Post: ${post.title}`,
    send_to: {
      list_ids: [process.env.SENDGRID_LIST_ID!],
    },
    email_config: {
      subject: `New Blog Post: ${post.title}`,
      html_content: html_content,
      sender_id: parseInt(process.env.SENDGRID_SENDER_ID!, 10),
    },
  };

  const [singleSendResponse] = await sendgrid.request({
    url: `/v3/marketing/singlesends`,
    method: "POST",
    body: singleSendData,
  });

  const singleSendId = (singleSendResponse.body as { id: string }).id;

  // schedule single send to send immediately
  await sendgrid.request({
    url: `/v3/marketing/singlesends/${singleSendId}/schedule`,
    method: "PUT",
    body: {
      send_at: sendAtIST,
    },
  });
  return true;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const title = formData.get("title") as string;
    const slug = formData.get("slug") as string;
    const body = formData.get("body") as string;
    const imageFile = formData.get("image") as File | null;

    if (!title || !slug || !body) {
      return NextResponse.json(
        { message: "Title, slug, and body are required" },
        { status: 400 }
      );
    }

    let imageUrl: string | undefined;

    if (imageFile && imageFile.size > 0) {
      const imageBuffer = await imageFile.arrayBuffer();
      const buffer = Buffer.from(imageBuffer);
      const stream = Readable.from(buffer);

      const uploadResult = await new Promise<any>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "blog_posts" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        stream.pipe(uploadStream);
      });
      imageUrl = uploadResult.secure_url;
    }

    const client = await clientPromise;
    const db = client.db("blog");

    const newPost = {
      title,
      slug,
      body,
      date: new Date().toISOString(),
      imageUrl,
    };

    await db.collection("posts").insertOne(newPost);

    let emailSent = false;
    // Send notification after successfully creating the post
    try {
      emailSent = await sendNotificationEmail(newPost);
    } catch (emailError) {
      console.error("Failed to send notification email:", emailError);
      // emailSent remains false
    }

    return NextResponse.json(
      {
        message: "Post created successfully",
        post: newPost,
        emailSent,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { message: "Failed to create post", error: (error as Error).message },
      { status: 500 }
    );
  }
}
