import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  (await cookies()).set("hii_box_token", "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
  });

  return NextResponse.json({ message: "Logged out" });
}
