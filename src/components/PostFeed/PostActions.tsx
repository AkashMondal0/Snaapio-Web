import React, { useCallback, useContext, useRef, useState } from 'react'
import { Heart, Send, MessageCircle, BookMarked } from 'lucide-react';
import { Notification, NotificationType, Post, disPatchResponse } from '@/types';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import LikeViewModal from '@/components/Dialog/View.Like.Dialog';
import { SocketContext } from '@/provider/Socket_Provider';
import { fetchPostLikesApi } from '@/redux-stores/slice/post/api.service';
import { createNotificationApi, destroyNotificationApi } from '@/redux-stores/slice/notification/api.service';
import { RootState } from '@/redux-stores/store';
import useDebounce from '@/lib/debouncing';
import { useGQMutation } from '@/lib/useGraphqlQuery';
import { QPost } from '@/redux-stores/slice/post/post.queries';

const PostActions = ({
    post,
    onNavigate
}: {
    post: Post
    onNavigate: (path: string) => void,
}) => {
    const dispatch = useDispatch();
    const [like, setLike] = useState({
        isLike: post.is_Liked,
        likeCount: post.likeCount
    })

    const { mutate } = useGQMutation<boolean>({
        mutation: QPost.createAndDestroyLike,
        onError: (err) => {
            setLike((pre) => ({
                isLike: !pre.isLike,
                likeCount: !pre.isLike ? pre.likeCount + 1 : pre.likeCount - 1
            }));
        }
    });

    const delayLike = useCallback((value: boolean) => {
        if (!post?.id) return;
        mutate({ input: { id: post?.id, like: value } })
    }, [post?.id])

    const debounceLike = useDebounce(delayLike, 500)

    const onLike = useCallback(() => {
        setLike((pre) => ({
            isLike: !pre.isLike,
            likeCount: !pre.isLike ? pre.likeCount + 1 : pre.likeCount - 1
        }))
        debounceLike(!like.isLike)
    }, [like.isLike, like.likeCount])

    const fetchLikes = useCallback(async () => {
        if (post.isDummy) return toast("this dummy post")
        dispatch(fetchPostLikesApi({
            offset: 0,
            limit: 16,
            id: post.id
        }) as any)
    }, [post.id, post.isDummy])

    return (
        <>
            <div className=' mt-5 mb-1 mx-3 flex justify-between'>
                <div className='flex space-x-3'>
                    <Heart className={`w-7 h-7 cursor-pointer 
                 ${like.isLike ? "text-red-500 fill-red-500" : ""}`}
                        onClick={onLike} />
                    <MessageCircle className='w-7 h-7 cursor-pointer hidden sm:block'
                        onClick={() => onNavigate(`/post/${post.id}`)} />
                    {/* sm */}
                    <MessageCircle className='w-7 h-7 cursor-pointer sm:hidden block'
                        onClick={() => onNavigate(`/post/${post.id}/comments`)} />

                    <Send className='w-7 h-7 cursor-pointer' />
                </div>
                <BookMarked className='w-7 h-7 cursor-pointer' />
            </div>
            <div className='mx-3 space-y-2'>
                {/* lg*/}
                <div className='font-semibold cursor-pointer sm:hidden block' onClick={() => {
                    onNavigate(`/post/${post.id}/liked_by`)
                }}>{like.likeCount} likes</div>
                {/* sm */}
                <LikeViewModal>
                    <div className='font-semibold cursor-pointer hidden sm:block' onClick={fetchLikes}>
                        {like.likeCount} likes
                    </div>
                </LikeViewModal>
            </div>
        </>

    )
}

export default PostActions