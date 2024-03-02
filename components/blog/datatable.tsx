import React from 'react'

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
let demoData = [
    {
        id: 1,
        title: 'Blog 1',
        description: 'This is blog 1',
        date: '2021-10-10',
        author: 'John Doe',
        status: 'published'
    },
    {
        id: 2,
        title: 'Blog 2',
        description: 'This is blog 2',
        date: '2021-10-10',
        author: "Ayush Shah",
        status: 'draft'
    },
    {
        id: 3,
        title: 'Blog 3',
        description: 'This is blog 3',
        date: '2021-10-10',
        author: 'John Doe',
        status: 'published'
    }
]
interface DemoData {
    id: string | number
    title: string,
    description: string,
    date: string,
    author: string,
    status: string
}
export const DataTable = () => {
    return (
        <div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Author</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Edit</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {demoData.map((row: DemoData) => {
                        return (
                            <TableRow key={row.id}>
                                <TableCell>{row.id}</TableCell>
                                <TableCell>{row.title}</TableCell>
                                <TableCell>{row.description}</TableCell>
                                <TableCell>{row.date}</TableCell>
                                <TableCell>{row.author}</TableCell>
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
