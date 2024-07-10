"use client"
import React, { useEffect, useState } from 'react'
import { CategoryDialog } from './category-dialog';
import { Checkbox } from '../ui/checkbox';
import { Button } from '../ui/button';
import { editCategory } from '@/actions/category';

export const CategoryShow = () => {
    const [category, setCategory] = useState([]);
    const [msg, setMsg] = useState("");
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        let fetchCategory = async () => {
            setLoading(true);
            try {
                let getData = await fetch("/api/blog/category", { cache: "no-cache" })
                let newData = await getData.json()
                if (!newData.error) {
                    setCategory(newData.data)
                }
            } catch (e) {
                console.log(e)
            }
            setLoading(false);
        }
        fetchCategory()
    }, [])
    if (!category) {
        return <div>No Category Found</div>
    }
    return (
        <div>
            <div className="flex justify-between">

                <h3 className='text-lg font-bold'>Category</h3>
                <CategoryDialog />
            </div>
            <p className="text">
                checked category will be shown in blog category
            </p>
            <ul>
                {category.map((cat: any) => (<div key={cat.id} className="flex items-center space-x-2 my-3">
                    <Checkbox
                        id={cat.id}
                        value={cat.id}
                        checked={cat.showInHome}
                        onCheckedChange={(e) => {
                            editCategory({ id: cat.id, showInHome: !!e, name: cat.name }).then((res) => {
                                console.log(res)
                            })
                            setCategory((curr: any) => curr.map((c: any) => {
                                if (c.id === cat.id) {
                                    return { ...c, showInHome: !!e }
                                }
                                return c
                            }))

                        }}
                    />
                    <label
                        htmlFor={cat.id}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                        {cat.name}
                    </label>
                </div>))}
            </ul>


        </div>
    )
}
