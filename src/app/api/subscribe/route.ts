import { NextResponse } from "next/server";
import sendgrid from "@sendgrid/client";

sendgrid.setApiKey(process.env.SENDGRID_API_KEY!);

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { message: "Email is required." },
        { status: 400 }
      );
    }

    const data = {
      contacts: [{ email }],
      list_ids: [process.env.SENDGRID_LIST_ID!],
    };

    const sgRequest = {
      url: `/v3/marketing/contacts`,
      method: "PUT" as const,
      body: data,
    };

    await sendgrid.request(sgRequest);

    return NextResponse.json(
      { message: "You're subscribed!" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("SendGrid Error:", error.response?.body || error);
    return NextResponse.json(
      { message: "Failed to subscribe. Please try again later." },
      { status: 500 }
    );
  }
}
