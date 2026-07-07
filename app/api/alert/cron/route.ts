import { NextResponse } from "next/server";

export async function GET() {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL;

    const res = await fetch(
      `${baseUrl}/api/check`
    );

    const data = await res.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Cron failed",
      },
      {
        status: 500,
      }
    );
  }
}