"use client"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { ColumnDef } from "@tanstack/react-table"
import Link from "next/link"
import { BsPen, BsTrash } from "react-icons/bs"
import { DeleteBlog } from "./delete-blog"
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
                <Link href={`/admin/blog/${row.getValue("id")}`}>
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
                <DeleteBlog id={row.getValue("id")} title={row.getValue("title")} />
            )
        }
    }
]