import { verifyAuth } from "@/app/lib/auth";
import User from "@/models/user";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const authCheck = verifyAuth(req);
    if (authCheck instanceof NextResponse) return authCheck;

    if (typeof authCheck === "string") {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const user = await User.findById(authCheck.userId).select("-password");
    return NextResponse.json(user);
}
