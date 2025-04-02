import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "@/models/user";
import connectDB from "@/app/lib/mongodb";
import { serialize } from "cookie";

export async function POST(req: Request) {
    try {
        await connectDB();
        const { email, password, rememberMe } = await req.json();

        interface UserWithPassword {
            _id: string;
            email: string;
            password: string;
            __v: number;
        }

        const existingUser = await User.findOne({ email }).lean() as UserWithPassword | null;
        if (!existingUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const isMatch = await bcrypt.compare(password, existingUser.password);
        if (!isMatch) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            throw new Error("JWT_SECRET is not defined in environment variables");
        }

        const tokenExpiry = rememberMe ? "30d" : "7d";
        const cookieMaxAge = rememberMe ? 30 * 24 * 60 * 60 : 7 * 24 * 60 * 60;

        const token = jwt.sign(
            { userId: existingUser._id.toString(), email: existingUser.email },
            jwtSecret,
            { expiresIn: tokenExpiry }
        );

        const response = NextResponse.json({ message: "Login successful" });
        response.headers.set(
            "Set-Cookie",
            serialize("token", token, {
                path: "/",
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: cookieMaxAge,
            })
        );

        return response;

    } catch (error: any) {
        console.error("Signin error:", error);
        return NextResponse.json({ error: error.message || "Server error" }, { status: 500 });
    }
}
