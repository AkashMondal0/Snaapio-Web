"use client"
import { CommentInput, CommentListSkeleton } from '@/components/PostFeed/Comment'
import NotFound from '@/components/Error/NotFound'
import { AppNavbar } from '@/components/Header/Header'
import { SkyAvatar } from '@/components/sky'
import { timeAgoFormat } from '@/lib/timeFormat'
import { Comment, Post, disPatchResponse } from '@/types'
import { Heart } from 'lucide-react'
import React, { memo, useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
import { RootState } from '@/redux-stores/store'
import { fetchOnePostApi, fetchPostCommentsApi } from '@/redux-stores/slice/post/api.service'
let loadedRef = false
let loadedPostId = "noPostId"

const Page = ({ params }: { params: { post: string } }) => {
  const dispatch = useDispatch()
  const post = useSelector((Root: RootState) => Root.PostState.viewPost)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const fetchApi = useCallback(async () => {
    try {
      const res = await dispatch(fetchOnePostApi({id:params.post}) as any) as disPatchResponse<Post>
      if (res.error) {
        setError(true)
        return toast.error("Failed to load post")
      }
      await dispatch(fetchPostCommentsApi({
        id: res.payload.id,
        offset: 0,
        limit: 12
      }) as any)
    } catch (e) {
      setError(true)
      toast.error("Failed to load post")
    } finally {
      setLoading(false)
    }
  }, [params.post])

  useEffect(() => {
    if (params.post !== loadedPostId) {
      fetchApi()
      loadedRef = true;
    }
  }, []);

  if (loading) return <CommentListSkeleton />

  if (error) return <NotFound />

  if (post) {
    return (
      <>
        {/* header */}
        <div className='max-w-[600px] w-full min-h-dvh mx-auto flex flex-col justify-between'>
          <div>
            {/* header */}
            <AppNavbar name="Comments" icon2={<div />} />
            <div className='h-full px-3 space-y-1'>
              <div className="flex border-b py-2 mb-4">
                <SkyAvatar url={post?.user?.profilePicture} className='h-12 w-12' />
                <div className="flex flex-col ml-4">
                  <p className="break-all"><span className='font-semibold text-lg'>
                    {post?.user?.username}</span> {post?.content}
                  </p>
                  <div className="text-sm text-gray-500">{timeAgoFormat(post?.createdAt)}</div>
                </div>
              </div>
              {/* list */}
              {!loading && post.comments.length <= 0 ? <EmptyComment /> :
                <div className='space-y-4'>
                  {post?.comments.map((comment, i) => <CommentItem key={i} comment={comment} />)}
                </div>}
            </div>
          </div>
          {/* input */}
          <CommentInput data={post} hideActionButtons />
        </div>
      </>
    )
  }
}

export default Page

const CommentItem = memo(function CommentItem({
  comment
}: {
  comment: Comment
}) {
  return (
    <>
      <div className="flex gap-2">
        <SkyAvatar url={comment?.user?.profilePicture}
          className='h-12 w-12 ' />

        <div className="flex justify-between items-center w-full flex-1">
          <div>
            <p className="break-all text-base">
              <span className='font-semibold text-lg mr-2'>
                {comment?.user?.username}
              </span>
              {comment?.content}
            </p>
            <div className="text-sm text-gray-500">{timeAgoFormat(comment?.createdAt)}</div>
          </div>

          {/* button */}
          <div className='flex items-center'>
            <Heart className="w-5 h-5" />
          </div>
        </div>
      </div>
    </>
  )
}, ((pre, next) => {
  return pre.comment.id === next.comment.id
    && pre.comment.content === next.comment.content
}))

const EmptyComment = () => {
  return <div className='flex justify-center items-center h-96'>
    <div>
      <p className='font-bold text-2xl text-center'>No comments yet</p>
      <p className='text-center'>Start the conversation.</p>
    </div>
  </div>
}