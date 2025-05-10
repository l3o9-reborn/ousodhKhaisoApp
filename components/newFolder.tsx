import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
  import {Label} from './ui/label'
  import {Input} from './ui/input'
  import { Button } from './ui/button'

import { FolderPlus } from 'lucide-react'
  

function NewFolder() {
  return (
    <div>
        <Dialog>
            <DialogTrigger className='fixed bottom-4 right-4'>
                <FolderPlus className=" bg-amber-600 p-4 rounded-full h-15 w-15 text-white shadow-2xl hover:scale-120 hover: transition-transform hover:bg-amber-500" />
            </DialogTrigger>
            <DialogContent className='space-y-4'>
                <DialogHeader>
                  <DialogTitle>Add New Record</DialogTitle>
                </DialogHeader>
                <DialogDescription className="space-y-2">
                    <Input
                        placeholder='Patient Name'
                        className='block w-full border-gray-300 rounded p-2'
                    />
                    <Button
                     className='mt-3 bg-amber-600 hover:bg-amber-500'
                     >
                        Create New Record
                     </Button>

                </DialogDescription>

            </DialogContent>
        </Dialog>

    </div>
  )
}

export default NewFolder