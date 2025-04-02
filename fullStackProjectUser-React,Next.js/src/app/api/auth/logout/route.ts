import { NextResponse } from "next/server";
import { serialize } from "cookie";

export async function POST() {
    const response = NextResponse.json({ message: "Logged out" });
    response.headers.set(
        "Set-Cookie",
        serialize("token", "", {
            path: "/",
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 0,
        })
    );
    return response;
}
