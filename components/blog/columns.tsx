"use client"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"
import { ColumnDef } from "@tanstack/react-table"
import Link from "next/link"
import { BsPen, BsTrash } from "react-icons/bs"
import { Button } from "../ui/button"
import { useRouter } from 'next/navigation'
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
import axios from "axios"
import { useToast } from "../ui/use-toast"
import { auth } from "@/auth"

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
        header: "Actions",
        id: "actions",
        cell: ({ row }) => {
            const handleDelete = () => {
                let res = axios.delete(`/api/blog/${row.original.id}`, {
                    method: "DELETE",
                })
                res.then(res => {
                    alert("Blog Deleted Succesfullly")
                    location.reload()
                }).catch(err => {
                    alert("Not Authorized")
                })
            }
            return (
                <AlertDialog>
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem><Link className="block w-full" href={`/admin/blog/${row.original.id}`}>Edit</Link></DropdownMenuItem>
                            <DropdownMenuItem>
                                <AlertDialogTrigger>Delete</AlertDialogTrigger>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure you want to delete this blog?</AlertDialogTitle>
                            <AlertDialogDescription>
                                {row.original.title}
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>)
        }
    }

]