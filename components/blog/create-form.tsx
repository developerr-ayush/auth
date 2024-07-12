"use client"
import React, { useCallback, useMemo, useRef, useState, useTransition, useEffect } from 'react'
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
import { useDropzone } from 'react-dropzone'
import Image from 'next/image'
import { Checkbox } from '../ui/checkbox'
import { CategoryDialog } from './category-dialog'
export const CreateForm = () => {
    const router = useRouter()
    const [pending, setPending] = useState(false)
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | undefined>("")
    const [glberror, setGlbError] = useState<string | undefined>("")
    const [success, setSuccess] = useState<string | undefined>("")
    const [category, setCategory] = useState<any[]>([])
    const [isCatUpdata, setIsCatUpdate] = useState(false)
    const config = useMemo(() => ({
        readonly: false,
        buttons: ["bold", "italic", "underline", "font", "fontsize", "ul", "ol", "indent", "outdent", "link", "image", "video", "table", "hr", "eraser", "source", "fullsize", "preview", "undo", "redo", "cut", "copy", "paste", "selectAll", "about"],
        toolbarAdaptive: false,
        enableDragAndDropFileToEditor: false,
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
            title: "",
            content: "",
            description: "",
            status: "draft",
            slug: "",
            date: new Date(Date.now()),
            banner: "",
            categories: [],
            tags: ""
        },
    })
    const handleUpload = async (file: File) => {
        const formData = new FormData();
        formData.append("path", "");
        formData.append("source", "default");
        formData.append("files[0]", file);
        const result = await fetch(`/api/blog/upload`, {
            method: "POST",
            body: formData
        })
        const newBlob = await result.json();
        return newBlob

    }

    const onSubmit = async (values: z.infer<typeof blogSchema>) => {
        setPending(true)
        if (!acceptedFiles.length) {
            form.setError("banner", { message: "Banner is required" });
            setPending(false)
            return
        }
        let res = await handleUpload(acceptedFiles[0])
        setError("")
        setSuccess("")
        createBlog({ ...values, banner: res.url }).then((data) => {
            if (data.error) {
                setError(data.error)
            } else {
                setSuccess(data.success)
                router.push('/admin/blog')
            }
            setPending(false)
        })
    }
    // dropzone
    const maxSize = 1048576; // 1 MB in bytes
    const [selectedImage, setSelectedImage] = useState<string | null>(null); // Update the type of selectedImage
    const [largefile, setLargeFile] = useState(false); // Update the type of selectedImage
    const { acceptedFiles, getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
        accept: {
            'image/jpeg': [],
            'image/png': []
        },
        maxSize: maxSize,
        multiple: false,
        onDrop: acceptedFiles => {
            setLargeFile(false);
            if (!acceptedFiles.length) return;
            setSelectedImage(URL.createObjectURL(acceptedFiles[0]));
            setPending(false)
        },
        onDropRejected: (rej) => {
            setLargeFile(false);
            console.log("reject", rej)
            setLargeFile(true);
        }
    });
    const isFileTooLarge = acceptedFiles.some(file => file.size > maxSize);
    useEffect(() => {
        let getCat = async () => {
            setPending(true)
            try {
                let getData = await fetch("/api/blog/category", { cache: "no-cache" })
                let newData = await getData.json()
                if (!newData.error) {
                    setCategory(newData.data)
                }
            } catch (e) {
                console.log(e)
            }
            setPending(false)

        };
        getCat()
    }, [isCatUpdata])

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
                                            {...field} onChange={(e) => {
                                                field.onChange(e)
                                                form.setValue("slug", e.target.value.toLowerCase().replace(/ /g, '-'))
                                            }} placeholder="Blog title" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField control={form.control}
                            name="slug"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Slug</FormLabel>
                                    <FormControl>
                                        <Input disabled={isPending}
                                            {...field}
                                            onChange={(e) => {
                                                form.setValue("slug", e.target.value.toLowerCase().replace(/ /g, '-'))
                                            }}
                                            placeholder="Blog Slug" />
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
                                        <div>
                                            <div {...getRootProps()} className={`dropzone  border-2 border-black min-h-40 p-3 flex flex-col justify-center items-center rounded-lg ${isDragActive ? 'border-solid' : 'border-dashed'} ${isDragReject ? 'reject' : ''}`}>
                                                <input {...getInputProps()} />
                                                <p>{isDragActive ? 'Drop the file here ...' : 'Drag and drop an image file here, or click to select file'}</p>
                                                <p>
                                                    Only *.jpeg and *.png images will be accepted less than 1MB
                                                </p>
                                                {isDragReject && <p className='text-red-600'>Only image files are allowed!</p>}
                                                {largefile && <p className="text-red-600">The file is too large! Max file size is 1MB. Or Not Supported</p>}
                                            </div>
                                            {selectedImage && (
                                                <div>
                                                    <h2>Preview:</h2>
                                                    <Image src={selectedImage} alt="Selected" width={300} height={300} />
                                                </div>
                                            )}
                                        </div>
                                    </FormControl>
                                    <FormMessage />


                                </FormItem>
                            )}
                        />
                        {/* category with multi select and add button*/}
                        {!!category.length && <FormField control={form.control}
                            name="categories"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Categories</FormLabel>
                                    <FormControl>
                                        <div>
                                            {category.map((cat) => (
                                                <div key={cat.id} className="flex items-center space-x-2 my-3">
                                                    <Checkbox id={cat.id} value={cat.id} onCheckedChange={(e) => {
                                                        if (e) {
                                                            field.onChange([...field.value, cat.id])
                                                        } else {
                                                            field.onChange(field.value.filter((v) => v !== cat.id))
                                                        }
                                                    }} />
                                                    <label
                                                        htmlFor={cat.id}
                                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                    >
                                                        {cat.name}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>

                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />}
                        <CategoryDialog setIsCatUpdate={setIsCatUpdate} />
                        {/* For Tags */}
                        <FormField control={form.control}
                            name="tags"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tags</FormLabel>
                                    <FormControl>
                                        <Input disabled={isPending}
                                            {...field} onChange={(e) => {
                                                field.onChange(e)
                                            }} placeholder="Tags seperated with Commas" />
                                    </FormControl>
                                    <FormMessage />
                                    <div className="showTags">
                                        <ul className="flex gap-4 p-0 ml-0 flex-wrap" style={{
                                            listStyle: "none",
                                            padding: "0",
                                        }}>
                                            {field && field?.value?.split(",")?.map((tag, index) => (
                                                <li key={index} className="inline-block bg-gray-200 rounded-full px-2 py-1 text-sm font-semibold text-gray-700">
                                                    {tag}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </FormItem>
                            )} />
                        <FormField control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Status</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="w-[180px]">
                                                <SelectValue placeholder="draft" />
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
                        <FormError message={error || glberror} />
                        <FormSuccess message={success} />
                        <Button disabled={isPending || pending} type="submit" className="w-[8rem]">{form.getValues("status") == "published" ? "Publish blog" : "Save Draft"}</Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}
