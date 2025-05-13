'use client'
import { Card } from "@/components/ui/card"
import { Folder, Delete } from "lucide-react";
import {useState} from 'react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {Label} from '@/components/ui/label'
import {Input} from '@/components/ui/input'
import { Button } from '@/components/ui/button'


import { useRouter } from "next/navigation";

type EMRFolderProps={
  id: string
  name: string;
  createdAt: string
  pdfUrls: string[]
}





function EMRFolder({ id, name, createdAt, pdfUrls}: EMRFolderProps) {

const router=  useRouter()
const[openDialog, setOpenDialog]= useState(false)
const [newName, setNewName] = useState(name)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  
const intoFolder=()=>{
    router.push(`/emrs/${id}`)
}

const deleteFolder=async()=>{
  try {

    const res= await fetch(`/api/emrs/${id}`,{
      method:"DELETE"
    })
    if (res.ok) {
        // Maybe provide a success message here or refresh data
        console.log("Folder deleted successfully");
        router.refresh()
    }
  } catch (error) {
    console.log("Error Deleting EMR")
  }
}
const editFolder=async()=>{

    setLoading(true);
    setError('');
    setSuccess('');


  try {
      const res = await fetch(`/api/emrs/${id}`, {
        method: "PUT",
        body: JSON.stringify({ name: newName }), // Send updated name
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.ok) {
        setSuccess('Record updated successfully!');
        console.log("Folder updated");
        setOpenDialog(false); // Close dialog after save
        router.refresh()
      } else {
        setError(result.error || 'Failed to update record');
        console.log("Error updating folder");
      }
    } catch (error) {
      setError('An error occurred while updating record');
      console.log("Error editing folder", error);
    } finally {
      setLoading(false);
    }
}


  return (
    <Card className=" items-center p-0 m-0 overflow-hidden relative">
    <div
      onClick={intoFolder}
     className="flex items-center justify-around">
      <Folder className=" p-0 m-0 h-30 w-20 text-amber-300 fill-amber-100"/>
     
      <div>
        <h3 className="text-2xl text-gray-700">{name}</h3>
        <span className="text-sm text-gray-500">{createdAt}</span>
      </div>
    </div>
    <DropdownMenu>
      <DropdownMenuTrigger>
          <span className="absolute  top-0 right-4 text-2xl font-bold text-amber-400">...</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent className=" absolute top-[-120px] right-[-120px] opacity-90">
        <DropdownMenuLabel>{name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={deleteFolder}>
            Delete
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Dialog>
              <DialogTrigger className="text-sm px-2 py-2 rounded hover:bg-gray-200 text-start w-full ">
                  Edit
              </DialogTrigger>
              <DialogContent className='space-y-4'>
                  <DialogHeader>
                    <DialogTitle>Edit Record</DialogTitle>
                  </DialogHeader>
                  {/* <DialogDescription className="space-y-2"> */}

                      <Input
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder="Patient Name"
                          className='block w-full border-gray-300 rounded p-2'
                      />

                      {/* Show success or error messages */}
                      {error && <div className="text-red-500">{error}</div>}
                      {success && <div className="text-green-500">{success}</div>}

                      <Button
                        onClick={editFolder}
                      className='bg-amber-600 hover:bg-amber-500 mt-3 '
                      disabled={loading}
                      >
                         {loading ? 'Saving...' : 'Save Record'}
                      </Button>
{/* 
                  </DialogDescription> */}

              </DialogContent>
          </Dialog>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
        
    </Card>
  )
}

export default EMRFolder