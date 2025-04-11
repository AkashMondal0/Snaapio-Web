import React from 'react'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import OptimizedImage from '../sky/SkyImage'
import { Post } from '@/types'
import { cn } from '@/lib/utils'

const PostImage = ({
    post,
}: {
    post: Post | null
}) => {

    if (!post) return null

    return (
        <div className='px-[2px] w-auto h-auto m-auto'>
            <div className='my-4 border-[1px] rounded-xl overflow-hidden'>
                <Carousel>
                    <CarouselContent>
                        {post.fileUrl.map((url, index) => (
                            <CarouselItem key={index} className='min-h-80 flex items-center m-auto'>
                                <OptimizedImage
                                    showErrorIcon
                                    src={url.original}
                                    width={500}
                                    height={500}
                                    alt="Picture of the author"
                                    fetchPriority={"high"}
                                    sizes={"(min-width: 808px) 50vw, 100vw"}
                                    className={cn('h-auto w-full cursor-pointer userNotSelectImg bg-muted rounded-xl')} />
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <div className='flex'>
                        <CarouselPrevious variant={"outline"} className='md:flex hidden left-2' />
                        <CarouselNext variant={"outline"} className='md:flex hidden right-2' />
                    </div>
                </Carousel>
            </div>
        </div>
    )
}

export default PostImage