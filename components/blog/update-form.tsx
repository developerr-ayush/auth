"use client"
import React, { useEffect, useMemo, useState, useTransition } from 'react'
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
import { updateBlog, getBlogById } from '@/actions/blog'
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
import { db } from '@/lib/db'
import { PutBlobResult } from '@vercel/blob'
import Image from 'next/image'

const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false });

export const UpdateForm = ({ id }: { id: string }) => {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(true)
    const [pending, setPending] = useState(false)
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | undefined>("")
    const [success, setSuccess] = useState<string | undefined>("")
    let [blog, setBlog] = useState<any>(null)
    const config = useMemo(() => ({
        readonly: false,
        // enable heading tag
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
    const handleBanner = async (e: any) => {
        setPending(true)
        const file = e.target.files[0]
        const formData = new FormData();
        formData.append("file", file);
        const result = await fetch(`/api/blog/upload?filename=${new Date().toLocaleDateString()}-${file.name}`, {
            method: "POST",
            body: file
        })
        const newBlob = (await result.json()) as PutBlobResult;
        form.setValue("banner", newBlob.url)
        setPending(false)

    }
    const form = useForm<z.infer<typeof blogSchema>>({
        resolver: zodResolver(blogSchema),
        defaultValues: {
            title: blog ? blog.title : "",
            description: blog ? blog.content : "",
            status: blog ? blog.status : "",
            banner: blog ? blog.banner : "",
            date: new Date(Date.now()),
        }
    })
    const onSubmit = (values: z.infer<typeof blogSchema>) => {
        setError("")
        setSuccess("")
        startTransition(() => {
            updateBlog(values, id).then((data) => {
                if (data.error) {
                    setError(data.error)
                } else {
                    setSuccess(data.success)
                    router.push('/admin/blog')
                }
            })
        })
    }
    useEffect(() => {
        setIsLoading(true)
        let getData = async () => {
            let blog = await getBlogById(id);
            if (blog) {
                setIsLoading(false)
                form.setValue("title", blog.title)
                form.setValue("description", blog.content)
                form.setValue("status", blog.status)
                form.setValue("banner", blog.banner)
                setBlog(blog)
            }
        }
        getData()

    }, [id])
    return isLoading ? <p>Loading...</p> : blog && (
        <div className='static-content'>
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
