import React from 'react'
import SkyAvatar from '../sky/SkyAvatar'
import OptimizedImage from '../sky/SkyImage'
import { cn } from '@/lib/utils'
import { Notification, NotificationType } from '@/types'
import { timeAgoFormat } from '@/lib/timeFormat'
import { useRouter } from 'next/navigation'

export const NotificationItem = ({
    data
}: {
    data?: Notification
}) => {
    const router = useRouter()
    const navigate = () => {
        router.push(`/post/p/${data?.post?.id}`)
    }

    const Description = (type?: NotificationType) => {
        switch (type) {
            case NotificationType.Like:
                return 'liked your post'
            case NotificationType.Comment:
                return `commented on your post: ${data?.comment?.content}`
            case NotificationType.Follow:
                return 'followed you'
            default:
                return ''
        }
    }

    return (
        <div className='flex cursor-pointer py-2 px-2 justify-between 
        duration-300 ease-in-out transition-all delay-75 rounded-xl
            hover:bg-accent hover:text-accent-foreground'>
            <div className='flex space-x-2 items-center cursor-pointer justify-between w-full'>
                <div className="flex-none" onClick={() => {
                    router.push(`/${data?.author?.username}`)
                }}>
                    <SkyAvatar url={data?.author?.profilePicture} className='h-12 w-12 mx-auto' />
                </div>
                <div className="grow leading-none">
                    <p className="break-all text-base font-light leading-none" onClick={() => {
                        router.push(`/${data?.author?.username}`)
                    }}>
                        <span className='font-semibold text-sm mr-1 break-words'>
                            {data?.author?.username}
                        </span>
                        <span className='break-words'>{Description(data?.type)}</span>
                    </p>
                    <span className='text-sm leading-none'>
                        {timeAgoFormat(data?.createdAt)}
                    </span>
                </div>

                <div onClick={navigate}
                    className='flex items-center flex-col flex-none h-12 w-12'>
                    <OptimizedImage
                        src={data?.post?.fileUrl[0].square_sm}
                        width={50}
                        height={50}
                        hideErrorLabel
                        showErrorIcon
                        alt="Picture of the author"
                        sizes={"(min-width: 808px) 20vw, 30vw"}
                        fetchPriority="high"
                        className={cn(`h-12 w-12 
                        cursor-pointer rounded-xl userNotSelectImg bg-muted object-cover p-0`)} />
                </div>
            </div>
        </div>
    )
}