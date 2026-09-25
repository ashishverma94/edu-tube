import { NextResponse } from "next/server";

import { getAuthUser } from "@/utils/auth";
import { prisma } from "@/config/prisma";

export async function GET() {
  try {
    const authUser = await getAuthUser();

    if (!authUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 },
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        id: authUser.userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User account no longer exists",
        },
        { status: 401 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Authenticated user",
        data: {
          user,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("AUTH_ME_API_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to verify authentication",
      },
      { status: 500 },
    );
  }
}
