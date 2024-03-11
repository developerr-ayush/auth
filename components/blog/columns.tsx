"use client"
import { ColumnDef } from "@tanstack/react-table"
import Link from "next/link"
import { BsPen, BsTrash } from "react-icons/bs"
export type Blogs = {
    id: string
    title: string
    createdAt: string
    updatedAt: string
    status: "published" | "draft" | "archived"
    author: {
        name: string
    }
}
export const columns: ColumnDef<Blogs>[] = [
    {
        header: "Title",
        accessorKey: "title",
    },
    // {
    //     header: "Created At",
    //     accessorKey: "createdAt",
    // },
    {
        header: "Updated At",
        accessorKey: "updatedAt",
        cell: ({ row }) => {
            return new Date(row.getValue("updatedAt")).toLocaleDateString()

        }
    },
    {
        header: "Status",
        accessorKey: "status",
    },
    {
        header: "Author",
        accessorKey: "author.name",
    },
    {
        header: "Edit",
        accessorKey: "id",
        cell: ({ row }) => {
            return (
                <Link href={`/blog/${row.getValue("id")}`}>
                    <BsPen />
                </Link>
            )
        }
    },
    {
        header: "Delete",
        accessorKey: "id",
        cell: ({ row }) => {
            return (
                <Link href={`/blog/delete/${row.getValue("id")}`}>
                    <BsTrash />
                </Link>
            )
        }
    }
]