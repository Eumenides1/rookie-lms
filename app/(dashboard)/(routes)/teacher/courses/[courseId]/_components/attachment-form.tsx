"use client"

import axios from 'axios'
import { Button } from '@/components/ui/button'
import { File, ImageIcon, Loader2, Pencil, PlusCircle, X } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { Attachment, Course } from '@prisma/client'
import Image from 'next/image'
import { FileUpload } from '@/components/file-upload'
import * as z from "zod"

interface AttachmentFormProps {
    initialData: Course & {attachments: Attachment[]}
    courseId: string
}

const formSchema = z.object({
    url: z.string().min(1)
})

export const AttachmentForm = ({
    initialData,
    courseId
}: AttachmentFormProps) => {

    const [isEditing, setIsEditing] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const toggleEdit = () => setIsEditing((current) => !current)
    const router = useRouter()

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.post(`/api/courses/${courseId}/attachments`, values)
            toast.success("课程更新成功")
            toggleEdit()
            router.refresh()
        } catch{
            toast.error("Something went wrong")
        }
    }

    const onDelete = async (id: string) => {
        try {
            setDeletingId(id);
            await axios.delete(`/api/courses/${courseId}/attachments/${id}`)
            toast.success("附件删除成功")
            router.refresh()
        } catch{
            toast.error("Something went wrong")
        } finally {
            setDeletingId(null)
        }
    }

    return (
        <div className='mt-6 border bg-slate-100 rounded-md p-4'>
            <div className='font-medium flex items-center justify-between'>
                课程资源 & 附件
                <Button onClick={toggleEdit} variant='ghost'>
                    {isEditing && (
                        <>
                            返回
                        </>
                    )}
                    {!isEditing && (
                        <>
                            <PlusCircle className='h-4 w-4 mr-2'/>
                            上传附件
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                <>
                {initialData.attachments.length === 0 && (
                    <p className='text-sm mt-2 text-slate-500 italic'>
                        空空如也，没有附件
                    </p>
                )}
                {initialData.attachments.length > 0 && (
                    <div className='space-y-2'>
                        {initialData.attachments.map((attachment)=> (
                            <div 
                                key={attachment.id}
                                className='flex items-center p-3 w-full bg-sky-100 
                                border-x-sky-200 border text-sky-700 rounded-md'
                                >
                                    <File className='h-4 w-4 mr-2 flex-shrink-0'/>
                                    <p className='text-xs line-clamp-1'>
                                        {attachment.name}
                                    </p>
                                    {deletingId === attachment.id && (
                                        <div>
                                            <Loader2 className='h-4 w-4 animate-spin'/>
                                        </div>
                                    )}
                                    {deletingId !== attachment.id && (
                                        <button 
                                            aria-label="删除附件"
                                            className='ml-auto hover:opacity-75 transition'
                                            onClick={() => onDelete(attachment.id)}>
                                            <X className='h-4 w-4'/>
                                        </button>
                                    )}
                            </div>
                        ))}
                    </div>
                )}
                </>
            )}
            {isEditing && (
                <div>
                    <FileUpload 
                        endpoint='courseAttachment'
                        onChange={(url) => {
                            if (url) {
                                onSubmit({url: url})
                            }
                        }}
                    />
                </div> 
            )}
        </div>
    )
}