"use client"
import React, { useMemo, useRef, useState, useTransition } from 'react'
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

import type { PutBlobResult } from '@vercel/blob';
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { useForm } from "react-hook-form"
import { blogSchema } from '@/schemas'
import dynamic from 'next/dynamic'
// import { createBlog } from '@/actions/blog'
const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false });
import { FormError } from '../form-error'
import { FormSuccess } from '../form-success'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { createBlog } from '@/actions/blog'
import Image from 'next/image'
export const CreateForm = () => {
    const router = useRouter()
    const [pending, setPending] = useState(false)

    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | undefined>("")
    const [success, setSuccess] = useState<string | undefined>("")
    const config = useMemo(() => ({
        readonly: false,
        buttons: ["bold", "italic", "underline", "font", "fontsize", "ul", "ol", "indent", "outdent", "link", "image", "video", "table", "hr", "eraser", "source", "fullsize", "preview", "undo", "redo", "cut", "copy", "paste", "selectAll", "about"],

        toolbarAdaptive: false,
        enableDragAndDropFileToEditor: true,
        uploader: {
            insertImageAsBase64URI: false,
            imagesExtensions: ['jpg', 'png', 'jpeg', 'gif'],
            format: "json",
            url: "/api/blog/upload?filename=blog-image.png",

            prepareData: function (data: any) {
                setPending(true)
                return data;
            },
            isSuccess: function (resp: any) {

                return !resp.error;
            },
            defaultHandlerSuccess: function (this: any, resp: any) { // `this` is the editor.
                const j = this;
                if (resp.files && resp.files.length) {
                    const tagName = 'img';
                    resp.files.forEach((filename: string, index: number) => { //edetor insertimg function
                        const elm = j.createInside.element(tagName);
                        console.log(filename, resp)
                        setPending(false)
                        elm.setAttribute('src', `${resp.baseurl}/${filename}`);
                        j.s.insertImage(elm as HTMLImageElement, null, j.o.imageDefaultWidth);
                    });
                }
            },
        }
    }), [])
    const form = useForm<z.infer<typeof blogSchema>>({
        resolver: zodResolver(blogSchema),
        defaultValues: {
            title: "",
            description: "",
            status: "draft",
            date: new Date(Date.now()),
            banner: ""
        }
    })
    const handleBanner = async (e: any) => {
        setPending(true)

        const file = e.target.files[0]
        const formData = new FormData();
        formData.append("path", "");
        formData.append("source", "default");
        formData.append("files[0]", file);
        const result = await fetch(`/api/blog/upload?filename=blog-image.png`, {
            method: "POST",
            body: formData
        })
        const newBlob = (await result.json()) as PutBlobResult;
        form.setValue("banner", newBlob.url)
        setPending(false)

    }
    const onSubmit = async (values: z.infer<typeof blogSchema>) => {
        setError("")
        setSuccess("")
        setPending(true)
        // console.log(values)
        createBlog(values).then((data) => {
            if (data.error) {
                setError(data.error)
            } else {
                setSuccess(data.success)
                router.push('/admin/blog')
            }
            setPending(false)

        })
    }
    return (
        <div className='static-content'>
            <Form {...form} >
                <form onSubmit={form.handleSubmit(onSubmit)} >

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
                                        {/* SOME EDITOR */}
                                        <JoditEditor value={field.value} onChange={field.onChange} config={config}></JoditEditor>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField control={form.control}
                            name="banner"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Banner Image</FormLabel>
                                    <FormControl>
                                        <Input disabled={isPending} placeholder="upload Image" type="file" accept="image/*" onChange={handleBanner} />
                                    </FormControl>

                                    {/* image preview  */}
                                    {field.value &&
                                        <Image src={field.value} width={200} height={200} alt='banner-image' />}
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
                        <Button disabled={isPending || pending} type="submit" className="w-[8rem]">Publish blog</Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}
