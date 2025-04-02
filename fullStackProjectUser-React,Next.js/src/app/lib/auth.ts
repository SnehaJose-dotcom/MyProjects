import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export const verifyAuth = (req: NextRequest) => {
    const token = req.cookies.get("token")?.value;
    if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        return decoded;
    } catch (error) {
        console.error("Auth verification error:", error);
        return NextResponse.json({ error: "Invalid token" }, { status: 403 });
    }
};
