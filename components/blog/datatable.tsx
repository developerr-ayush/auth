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
interface DemoData {
    id: string;
    title: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    authorId: string;
    status: string;
}
export const DataTable = () => {
    // const data = await showBlog()
    const [data, setData] = useState(null)
    useEffect(() => {
        let updateData = async () => {
            let blog = await fetch("/api/blog", { cache: "no-cache" })
            let data = await blog.json()
            setData(data)
            console.log(data)
        }
        updateData()
    }, [])
    return (
        <div>
            <Table>
                <TableHeader>
                    <TableRow>
                        {/* <TableHead>ID</TableHead> */}
                        <TableHead>Title</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Edit</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {!!data && Array.isArray(data) && data.map((row: DemoData) => {
                        return (
                            <TableRow key={row.id}>
                                {/* <TableCell>{row.id}</TableCell> */}
                                <TableCell>{row.title}</TableCell>
                                <TableCell>{new Date(row.updatedAt).toLocaleDateString()}</TableCell>
                                <TableCell>{row.status}</TableCell>
                                <TableCell><Link href={`/admin/blog/${row.id}/edit`}><BsPen /></Link></TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </div>
    )
}
