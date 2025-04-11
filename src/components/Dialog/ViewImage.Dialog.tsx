"use client"
import React from 'react'
import { TempleDialog } from '@/components/Dialog/Temple.Dialog'
import OptimizedImage from '../sky/SkyImage'
import { Assets } from '@/types'


const ViewImageDialog = ({
    children,
    photos
}: {
    children: React.ReactNode
    photos: Assets[]
}) => {
    return (<TempleDialog TriggerChildren={children} headerTitle={'Photos'}>
        {photos?.map((asset, index) => {
            if (asset.type === "image") {
                return <div key={index}>
                    <div className='flex justify-end items-end py-2'>
                        <OptimizedImage
                            key={index}
                            className='max-h-full w-full object-cover rounded-xl'
                            src={asset.original} alt="image" width={100} height={100} />
                    </div>
                </div>
            }
            // if (asset) {
            //   return <video src={asset.url} controls key={index} className={`object-cover h-60 w-48 rounded-3xl mb-2`} />
            // }
            // if (asset) {
            //   return <audio key={index} src={asset.url} controls className={`object-cover h-60 w-48 rounded-3xl mb-2`} />
            // }
            return <></>
        })}
    </TempleDialog>)
}

export default ViewImageDialog