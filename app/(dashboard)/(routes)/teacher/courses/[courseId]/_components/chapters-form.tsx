"use client"

import * as z from 'zod'
import axios from 'axios'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { FormControl,Form,FormField,FormMessage,FormItem } from "@/components/ui/form"
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Chapter, Course } from '@prisma/client'
import { Input } from '@/components/ui/input'

interface ChapterFormProps {
    initialData: Course & {chapters : Chapter[]}
    courseId: string
}

const formSchema = z.object({
    title: z.string().min(1)
})

export const ChapterForm = ({
    initialData,
    courseId
}: ChapterFormProps) => {
    const [isCreating, setIsCreating] = useState(false)
    const [isUpdating, setIsUpdating] = useState(false);
    const toggleCreating = () => setIsCreating((current) => !current)
    const router = useRouter()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title:  ""
        }
    })

    const { isSubmitting, isValid }  = form.formState
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.post(`/api/courses/${courseId}/chapters`, values)
            toast.success("章节新建成功")
            toggleCreating()
            router.refresh()
        } catch{
            toast.error("Something went wrong")
        }
    }

    return (
        <div className='mt-6 border bg-slate-100 rounded-md p-4'>
            <div className='font-medium flex items-center justify-between'>
                章节内容
                <Button onClick={toggleCreating} variant='ghost'>
                    {isCreating ? (
                        <>返回</>
                    ):(
                        <>
                            <PlusCircle className='h-4 w-4 mr-2'/>
                            添加章节
                        </>
                    )}
                </Button>
            </div>
            {isCreating && (
                <Form {...form}>
                    <form 
                        onSubmit={form.handleSubmit(onSubmit)}
                        className='space-y-4 mt-4'
                    >
                        <FormField 
                            control={form.control}
                            name="title"
                            render={({field}) => (
                                <FormItem>
                                    <FormControl>
                                        <Input 
                                            disabled={isSubmitting}
                                            placeholder='e.g. "本章节的核心是..."'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button disabled={!isValid || isSubmitting} type='submit'>
                            创建
                        </Button>

                    </form>
                </Form>
            )}
            {
                !isCreating && (
                    <div className={cn(
                        "text-sm mt-2",
                        !initialData.chapters.length && "text-slate-500 italic"
                    )}>
                        {!initialData.chapters.length && "没有任何章节"}
                        {/* TODO Add a List of Chapters */}
                    </div>
                )
            }
            {
                !isCreating && (
                    <p className='text-xs text-muted-foreground mt-4'>
                        拖放以对章节重新排序
                    </p>
                )
            }
        </div>
    )
}