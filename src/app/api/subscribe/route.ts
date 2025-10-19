import { NextResponse } from "next/server";
import FormData from "form-data";
import Mailgun from "mailgun.js";

const mailgun = new Mailgun(FormData);
const mg = mailgun.client({
  username: "api",
  key: process.env.MAILGUN_API_KEY!,
});

const MAILGUN_LIST = process.env.MAILGUN_MAILING_LIST!;

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { message: "Email is required." },
        { status: 400 }
      );
    }

    try {
      const members = await (mg.lists.members as any).listMembers(MAILGUN_LIST);
      const exists = members.items?.some((m: any) => m.address === email);
      if (exists) {
        return NextResponse.json(
          { message: "You are already subscribed." },
          { status: 200 }
        );
      }
    } catch (err: any) {
      console.error("Error checking member:", err);
    }

    await (mg.lists.members as any).createMember(MAILGUN_LIST, {
      address: email,
      subscribed: true,
    });

    return NextResponse.json(
      { message: "You have been subscribed!" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Mailgun Error:", error.message || error);
    return NextResponse.json(
      { message: "Failed to subscribe. Please try again later." },
      { status: 500 }
    );
  }
}
