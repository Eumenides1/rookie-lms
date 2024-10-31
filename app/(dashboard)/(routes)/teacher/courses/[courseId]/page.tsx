// 将 CourseIdPage 定义为服务器端组件
export default async function CourseIdPage({ params }: { params: { courseId: string } }) {
    const { courseId } = await params.courseId;
    
    return (
        <div>
            CourseId: {courseId}
        </div>
    );
}
