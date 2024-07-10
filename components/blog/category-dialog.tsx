import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { useState } from "react"
import { createCategory } from "@/actions/category"

export function CategoryDialog({ setIsCatUpdate }: any) {
    const [category, setCategory] = useState("")
    const [msg, setMsg] = useState("")
    const [global, setGlobal] = useState("")
    const addCategory = () => {
        createCategory(category).then((res) => {
            if (res.error) {
                setMsg(res.error)
                setTimeout(() => {
                    setMsg("")
                }, 1000)
                return;
            };
            setGlobal(res.success ? res.success : "")
            setTimeout(() => {
                setGlobal("")
            }, 1000)
            setIsCatUpdate((curr: boolean) => !curr)
            setCategory("")
        })
    }
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">Add Category</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <div className="">
                    <FormItem >
                        <FormLabel>Add Category</FormLabel>
                        <FormControl >
                            <Input
                                value={category}
                                onChange={(e) => {
                                    setCategory(e.target.value.trim())
                                }} placeholder="Blog Category" />
                        </FormControl>
                        <FormMessage >
                            {msg}
                        </FormMessage>
                        <FormMessage className="text-green-600" >
                            {global}
                        </FormMessage>
                    </FormItem>
                </div>
                <DialogFooter>
                    <Button type="submit" onClick={addCategory}>Add Category</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
