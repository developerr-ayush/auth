import React, { useState } from 'react'
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
export const EditUser = ({ id }: { id: string }) => {
    const [category, setCategory] = useState("")
    const [msg, setMsg] = useState("")
    const [global, setGlobal] = useState("")
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">Edit</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <div>
                    <FormItem>
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
                    <Button type="submit">Add Category</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
