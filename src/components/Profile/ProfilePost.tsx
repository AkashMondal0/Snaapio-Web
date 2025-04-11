"use client"
import React, { memo } from 'react'
import { cn } from '@/lib/utils'
import { Copy, Heart, MessageCircle } from 'lucide-react'
import { Post } from '@/types'
import OptimizedImage from '@/components/sky/SkyImage'
import { useRouter } from 'next/navigation'

export const ProfilePost = memo(function ImageComponent({
    data
}: {
    data: Post
}) {
    const router = useRouter()
    if (!data) {
        return <div className="h-full aspect-square w-full" />
    }
    return (
        <>
            <div className='relative transition-all duration-300 ease-in-out w-full h-full cursor-pointer'>
                {data?.fileUrl.length > 1 ? <Copy className='absolute top-2 right-2 text-white' /> : <></>}
                <div className='absolute top-0 left-0 right-0 hover:bg-black/50
            bottom-0 flex justify-center items-center opacity-0 inset-0
             hover:opacity-100 transition-all duration-300 ease-in-out'>
                    {/* center  */}
                    {/* lg */}
                    <div className='md:flex hidden w-full h-full justify-center items-center' onClick={() => {
                        router.push(`/post/${data.id}`)
                    }}>
                        <div className='flex space-x-2'>
                            <Heart className='fill-current text-white' />
                            <p className=' font-semibold text-base text-white'>{data.likeCount || 0}</p>
                            <MessageCircle className='fill-current text-white' />
                            <p className=' font-semibold text-base text-white'>{data.commentCount || 0}</p>
                        </div>
                    </div>
                    {/* sm */}
                    <div className='flex md:hidden w-full h-full justify-center items-center' onClick={() => {
                        router.push(`/post/p/${data.id}`)
                    }}>
                        <div className='flex space-x-2'>
                            <Heart className='fill-current text-white' />
                            <p className=' font-semibold text-base text-white'>{data.likeCount || 0}</p>
                            <MessageCircle className='fill-current text-white' />
                            <p className=' font-semibold text-base text-white'>{data.commentCount || 0}</p>
                        </div>
                    </div>
                </div>
                <OptimizedImage
                    fetchPriority="high"
                    src={data?.fileUrl[0]?.original}
                    width={300}
                    height={300}
                    showErrorIcon
                    sizes="(min-width: 808px) 20vw, 40vw"
                    className={cn(`aspect-square hover:opacity-50 
                    w-full h-full object-cover userNotSelectImg bg-muted`)} />
            </div>
        </>
    )
}, ((pre: any, next: any) => {
    return pre.id === next.id
}))
