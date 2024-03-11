import React from 'react'
import { Button } from '../ui/button'
import { deleteUser } from '@/actions/delete'

export const DeleteUser = ({ id }: { id: string }) => {
  return (
    <Button variant="destructive" onClick={() => {
      let x = confirm('Are you sure you want to delete this user?')
      if (x) {
        deleteUser(id).then((data: any) => {
          if (data?.error) {
            alert(data.error)
          } else {
            alert(data.success)
            location.reload()
          }
        })
      }
    }}>Delete</Button>
  )
}
