import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function DELETE(
    req: Request,
    {params}: {params: {courseId: string, attachmentId: string}}
) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return new NextResponse("未授权用户，请登录", {status: 401})
        }
        const courseOwner = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId: userId
            }
        })
        if (!courseOwner) {
            return new NextResponse("未允许操作", {status: 401})
        }
        const attachment = await db.attachment.delete({
            where: {
                courseId: params.courseId,
                id: params.attachmentId
            }
        })
        
        return NextResponse.json(attachment)
    } catch (error) {
        console.log("[ATTACHMENTS_ID_ERROR]", error);
        return new NextResponse("Internal Error", {status: 500})
    }
}