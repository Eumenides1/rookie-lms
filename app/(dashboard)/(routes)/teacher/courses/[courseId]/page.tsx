import React from "react";

async function CourseIdPage({ params }: { params: { courseId: string } }) {
    const { courseId } = await params;
    return <p>课程 ID: {courseId}</p>;
}

export default CourseIdPage;
