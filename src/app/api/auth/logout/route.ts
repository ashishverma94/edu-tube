import { NextResponse } from "next/server";

import { clearAuthCookie } from "@/utils/auth";

export async function POST() {
  try {
    await clearAuthCookie();

    return NextResponse.json(
      {
        success: true,
        message: "Logged out successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("AUTH_LOGOUT_API_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to logout",
      },
      { status: 500 },
    );
  }
}