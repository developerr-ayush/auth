"use client"
import React, { useState, useTransition } from 'react'
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { useForm } from "react-hook-form"
import { blogSchema } from '@/schemas'
import dynamic from 'next/dynamic'
import "easymde/dist/easymde.min.css";
import { register } from 'module'
import { auth } from '@/auth'
import { createBlog } from '@/actions/blog'
import { FormError } from '../form-error'
import { FormSuccess } from '../form-success'
import { Checkbox } from '../ui/checkbox'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useRouter } from 'next/navigation'

const SimpleMDE = dynamic(() => import('react-simplemde-editor'), { ssr: false })
export const CreateForm = () => {
    const router = useRouter()
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | undefined>("")
    const [success, setSuccess] = useState<string | undefined>("")
    const form = useForm<z.infer<typeof blogSchema>>({
        resolver: zodResolver(blogSchema),
        defaultValues: {
            title: "",
            description: "",
            status: "draft",
            date: new Date(Date.now()),
        }
    })
    const onSubmit = (values: z.infer<typeof blogSchema>) => {
        console.log(values)
        setError("")
        setSuccess("")
        startTransition(() => {
            createBlog(values).then((data) => {
                if (data.error) {
                    setError(data.error)
                } else {
                    setSuccess(data.success)
                    router.push('/admin/blog')
                }
            })
        })
    }
    return (
        <div>
            <Form {...form} >
                <form onSubmit={form.handleSubmit(onSubmit)}>

                    <div className="space-y-4">
                        <FormField control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input disabled={isPending}
                                            {...field} placeholder="Blog title" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <SimpleMDE value={field.value} onChange={field.onChange} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Status</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="w-[180px]">
                                                <SelectValue placeholder="Draft" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="draft">Draft</SelectItem>
                                            <SelectItem value="published">Published</SelectItem>
                                            <SelectItem value="archived">Archived</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormError message={error} />
                        <FormSuccess message={success} />
                        <Button disabled={isPending} type="submit" className="w-[8rem]">Publish blog</Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}
