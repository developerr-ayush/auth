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
const blogs = [
    {
        title: "Lorem ipsum dolor",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        author: "John Doe",
        status: "draft"
    },
    {
        title: "Vestibulum ante ipsum",
        description: "Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae.",
        author: "Jane Smith",
        status: "published"
    },
    {
        title: "Nulla facilisi",
        description: "Nulla facilisi. Nullam tristique urna sit amet odio consectetur, non maximus ex fermentum.",
        author: "David Johnson",
        status: "archived"
    },
    {
        title: "Fusce consectetur",
        description: "Fusce consectetur, nunc ut varius consequat, erat neque tincidunt purus.",
        author: "Emily Brown",
        status: "draft"
    },
    {
        title: "Aliquam erat volutpat",
        description: "Aliquam erat volutpat. Sed in mi at enim malesuada dictum.",
        author: "Michael Wilson",
        status: "published"
    },
    {
        title: "Cras commodo interdum",
        description: "Cras commodo interdum ligula, ut tincidunt sem malesuada sit amet.",
        author: "Sarah Lee",
        status: "draft"
    },
    {
        title: "Pellentesque eget commodo",
        description: "Pellentesque eget commodo libero. In hac habitasse platea dictumst.",
        author: "Andrew Taylor",
        status: "published"
    },
    {
        title: "Curabitur vel justo",
        description: "Curabitur vel justo ut quam auctor tempus. Fusce consectetur, nisi vitae lacinia tincidunt.",
        author: "Jessica Garcia",
        status: "archived"
    },
    {
        title: "Integer auctor odio",
        description: "Integer auctor odio nec mauris convallis, eget tincidunt urna gravida.",
        author: "Daniel Martinez",
        status: "draft"
    },
    {
        title: "Suspendisse potenti",
        description: "Suspendisse potenti. Duis convallis urna et mi convallis, a hendrerit turpis vehicula.",
        author: "Olivia Hernandez",
        status: "published"
    }
];

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
