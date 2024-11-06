"use client"

import { Chapter } from "@prisma/client"
import { useEffect, useState } from "react";
import {
    DragDropContext,
    Droppable,
    Draggable,
    DropResult
} from "@hello-pangea/dnd"

import { cn } from "@/lib/utils";
import { Grip, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ChapterListProps {
    items: Chapter[];
    onReorder: (updateData: {id: string, position: number}[]) => void;
    onEdit: (id: string) => void;
};

export const ChapterList = ({
    items,
    onReorder,
    onEdit
}:ChapterListProps) => {
    // isMounted 用来跟踪组件是否已经完成挂载
    const [isMounted, setIsMounted] = useState(false);
    // chapters 用来存储和管理章节数据，初始值为传入的 items
    const [chapters, setChapters] = useState(items);

    useEffect(() => {setChapters(items)},[items])

    useEffect(() => {
        setIsMounted(true)
    },[]) // 空依赖数组表示这个效果只在组件首次挂载时执行一次
    // 处理拖拽结束事件
    const onDragEnd = (result: DropResult) => {
        // 如果没有目标位置，直接返回
        if (!result.destination) return
        // 创建章节数组的副本
        const items = Array.from(chapters);
        // 从原位置删除被拖动的项目
        const [reorderedItem] = items.splice(result.source.index, 1)
        // 将项目插入到新位置
        items.splice(result.destination.index, 0, reorderedItem)
        // 计算受影响的章节范围
        const startIndex = Math.min(result.source.index, result.destination.index)
        const endIndex = Math.max(result.source.index, result.destination.index)
        // 获取需要更新的章节
        const updatedChapters = items.slice(startIndex, endIndex + 1)
        setChapters(items);
        // 构建批量更新数据
        const bulkUpdateData = updatedChapters.map((chapter) => ({
            id: chapter.id,
            position: items.findIndex((item) => item.id === chapter.id)
        }))
        onReorder(bulkUpdateData);
    }
    // 如果组件未挂载，返回null
    if (!isMounted) {
        return null;
    }

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="chapters">
                {
                    (provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef}>
                            {chapters.map((chapter, index) => (
                                <Draggable
                                    key={chapter.id}
                                    draggableId={chapter.id}
                                    index={index}
                                >
                                    {(provided) => (
                                        <div
                                            className={cn(
                                                "flex items-center gap-x-2 bg-slate-200 border-slate-200 border text-slate-700 rounded-md mb-4 text-sm",
                                                chapter.isPublished && "bg-sky-100 border-sky-200 text-sky-700"
                                            )}
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                        >
                                             {/* 拖动手柄区域 */}
                                            <div
                                                className={cn("px-2 py-3 border-r border-r-slate-200 hover:bg-slate-300 rounded-l-md transition",
                                                    chapter.isPublished && "border-r-sky-200 hover:bg-sky-200"
                                                )}
                                                {...provided.dragHandleProps}
                                            >
                                                <Grip 
                                                    className="h-5 w-5"
                                                />
                                            </div>
                                            {chapter.title}
                                            <div className="ml-auto pr-2 flex items-center gap-x-2">
                                                {chapter.isFree && (
                                                    <Badge>
                                                        Free
                                                    </Badge>
                                                )}
                                                <Badge className={cn("bg-slate-500", chapter.isPublished && "bg-sky-700")}>
                                                    {chapter.isPublished ? "已发布": "草稿"}
                                                </Badge>
                                                <Pencil 
                                                    onClick={() => onEdit(chapter.id)}
                                                    className="w-4 h-4 cursor-pointer hover:opacity-75 transition"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )
                }
            </Droppable>
        </DragDropContext>
    )
}