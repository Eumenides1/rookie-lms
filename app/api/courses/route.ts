import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { db } from "../../../lib/db"

export async function POST(req:Request) {
    try {
        const { userId } = await auth();
        const { title } = await req.json();

        if (!userId) {
            return new NextResponse("未授权用户，请登录", {status: 401})
        }
        const course = await db.course.create({
            data: {
                userId,
                title
            }
        });
        return NextResponse.json(course);
    } catch (error) {
        console.log("[COURSES]", error);
        return new NextResponse("Internal Error", {status: 500})
    }
}