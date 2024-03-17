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
import { useDropzone } from 'react-dropzone'
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
        theme: 'dark',
        style: {
            background: 'hsl(var(--background))',
            color: 'hsl(var(--foreground))',
        },
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
                        elm.setAttribute('src', `${filename}`);
                        j.s.insertImage(elm as HTMLImageElement, null, j.o.imageDefaultWidth);
                    });
                }
            },
        }
    }), [])
    const form = useForm<z.infer<typeof blogSchema>>({
        resolver: zodResolver(blogSchema),
        defaultValues: {
            title: blog ? blog.title : "",
            description: blog ? blog.content : "",
            content: blog ? blog.content : "",
            status: blog ? blog.status : "",
            banner: blog ? blog.banner : "",
            date: new Date(Date.now()),
        }
    })

    const handleUpload = async (file: File) => {
        const formData = new FormData();
        formData.append("path", "");
        formData.append("source", "default");
        formData.append("files[0]", file);
        const result = await fetch(`/api/blog/upload?filename=blog-image.png`, {
            method: "POST",
            body: formData
        })
        const newBlob = (await result.json()) as PutBlobResult;
        return newBlob

    }

    const onSubmit = async (values: z.infer<typeof blogSchema>) => {
        setPending(true)
        console.log(values, acceptedFiles[0])
        try {
            setError("")
            setSuccess("")
            let res = values.banner
            if (acceptedFiles.length) {
                let blog = await handleUpload(acceptedFiles[0])
                res = blog.url
            }
            console.log(res)
            startTransition(() => {
                updateBlog({ ...values, banner: res }, id).then((data) => {
                    if (data.error) {
                        setError(data.error)
                    } else {
                        setSuccess(data.success)
                        router.push('/admin/blog')
                    }
                    setPending(false)

                }).catch(e => {
                    setPending(false)

                })
            })

        } catch (e) {
            console.log(e)
        }
    }
    // dropzone
    const maxSize = 1048576; // 1 MB in bytes
    const [selectedImage, setSelectedImage] = useState<string | null>(null); // Update the type of selectedImage
    const { acceptedFiles, getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
        accept: {
            'image/jpeg': [],
            'image/png': []
        },
        maxSize: maxSize,
        multiple: false,
        onDrop: acceptedFiles => {
            setSelectedImage(URL.createObjectURL(acceptedFiles[0]));
        }
    });
    const isFileTooLarge = acceptedFiles.some(file => file.size > maxSize);
    useEffect(() => {
        setIsLoading(true)
        let getData = async () => {
            let blog = await getBlogById(id);
            if (blog) {
                setIsLoading(false)
                form.setValue("title", blog.title)
                if (!!blog.description) {
                    form.setValue("description", blog.description)
                }
                form.setValue("content", blog.content)
                form.setValue("status", blog.status)
                form.setValue("banner", blog.banner)
                console.log(blog)
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
                                        <Input disabled={isPending}
                                            {...field} placeholder="Blog Description" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField control={form.control}
                            name="content"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Content</FormLabel>
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
                                        <div>
                                            <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''} ${isDragReject ? 'reject' : ''}`}>
                                                <input {...getInputProps()} />
                                                <p>{isDragActive ? 'Drop the file here ...' : 'Drag and drop an image file here, or click to select file'}</p>
                                                {isDragReject && <p>Only image files are allowed!</p>}
                                                {isFileTooLarge && <p>The file is too large! Max file size is 1MB.</p>}
                                            </div>
                                            {selectedImage && (
                                                <div>
                                                    <h2>Preview:</h2>
                                                    <Image src={selectedImage} alt="Selected" width={300} height={300} />
                                                </div>
                                            )}
                                        </div>
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
