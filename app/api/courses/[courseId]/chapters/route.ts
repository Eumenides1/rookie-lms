import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
    {params}: {params : {courseId: string}}
) {
    try {
        const { userId } = await auth();
        const { title } = await req.json()

        const courseId = await params.courseId

        if (!userId) {
            return new NextResponse("未授权用户，请登录", {status: 401})
        }

        const courseOwner = await db.course.findUnique({
            where: {
                id: courseId,
                userId: userId
            }
        })

        if (!courseOwner) {
            return new NextResponse("未允许操作", {status: 401})
        }

        const lastChapter = await db.chapter.findFirst({
            where: {
                courseId: courseId,
            },
            orderBy: {
                position: "desc"
            }
        });

        const newPosition = lastChapter ? lastChapter.position + 1 : 1

        const chapter = await db.chapter.create({
            data: {
                title,
                courseId: courseId,
                position: newPosition
            }
        });
        return NextResponse.json(chapter)
    } catch (error) {
        console.log("[CHAPTERS]", error);
        return new NextResponse("Internal Error", {status: 500})
    }
}