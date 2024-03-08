"use client"
import React, { useEffect, useState } from 'react'

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { BsPen } from 'react-icons/bs'
import Link from 'next/link'
import { showBlog } from '@/actions/blog'
interface BlogData {
    id: string;
    title: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    authorId: string;
    status: string;
    author: {
        name: string
    }
}
interface error {
    error: string
}
export const DataTable = () => {
    const [data, setData] = useState<BlogData[] | null | error>(null)
    useEffect(() => {
        let updateData = async () => {
            try {
                let blog = await fetch("/api/blog", { cache: "no-cache" })
                let data: BlogData[] = await blog.json()
                console.log(data)
                setData(data)
            } catch (e) {
                console.log(e)
            }
        }
        updateData()
    }, [])
    return (!!data && !('error' in data)) && (
        <div>
            <Table>
                <TableHeader>
                    <TableRow>
                        {/* <TableHead>ID</TableHead> */}
                        <TableHead>Title</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Author</TableHead>
                        <TableHead>Edit</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((row: BlogData) => {
                        return (
                            <TableRow key={row.id}>
                                {/* <TableCell>{row.id}</TableCell> */}
                                <TableCell>{row.title}</TableCell>
                                <TableCell>{new Date(row.updatedAt).toLocaleDateString()}</TableCell>
                                <TableCell>{row.status}</TableCell>
                                <TableCell>{row.author.name}</TableCell>
                                <TableCell><Link href={`/admin/blog/${row.id}/edit`}><BsPen /></Link></TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </div>
    )
}
