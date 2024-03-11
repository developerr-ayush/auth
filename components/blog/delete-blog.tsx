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
import { BsTrash } from "react-icons/bs"

export const DeleteBlog = ({ id, title }: { id: string, title: string }) => {
    const handleDelete = () => {
        let res = axios.delete(`/api/blog/${id}`, {
            method: "DELETE",
        })
        res.then(res => {
            alert('Blog Deleted')
            location.reload()
        }).catch(err => {
            console.log(err)
        })
    }
    return (
        <AlertDialog>
            <AlertDialogTrigger><BsTrash /></AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure you want to delete this blog?</AlertDialogTitle>
                    <AlertDialogDescription>
                        {title}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
