import React from 'react'
import PdfGrid from '@/components/pdfGrid'
import NewFile from '@/components/newFile'

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
  } from "@/components/ui/breadcrumb"


function SingleEmr() {
    return (
        <main className="min-h-screen bg-white">
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>Folder Name</BreadcrumbItem>
                <BreadcrumbSeparator/>
                <BreadcrumbItem>File Name</BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
          <PdfGrid />
          <div>
            <NewFile/>
          </div>
        </main>
      )
}

export default SingleEmr