"use client"
import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import NotFound from '@/components/Error/NotFound'
import { ModelPostSkeleton, PostFeed, PostFeedSkeleton, PostImage } from '@/components/PostFeed'
import { CommentHeader, CommentInput, CommentList } from '@/components/PostFeed/Comment'
import { AppNavbar } from '@/components/Header/Header'
import { RootState } from '@/redux-stores/store'
import { fetchOnePostApi } from '@/redux-stores/slice/post/api.service'

const PostPage = ({ params }: { params: { post: string } }) => {
  const dispatch = useDispatch()
  const post = useSelector((Root: RootState) => Root.PostState.viewPost)
  const loading = useSelector((Root: RootState) => Root.PostState.viewPostLoading)
  const error = useSelector((Root: RootState) => Root.PostState.viewPostError)

  const loadedRef = useRef(false)

  useEffect(() => {
    if (!loadedRef.current) {
      dispatch(fetchOnePostApi({id:params.post}) as any)
      loadedRef.current = true;
    }
  }, []);

  if (loading !== "normal" || !loadedRef.current) {
    return <>
      <div className='w-full md:flex justify-center hidden'>
        <div className='w-max'><ModelPostSkeleton /></div>
      </div>
      <div className="w-full h-full flex md:hidden flex-col">
        <AppNavbar name="Post" icon2={<div />} />
        <PostFeedSkeleton />
      </div>
    </>
  }

  if (loading !== "normal" && error || !post) {
    if (!error) return <NotFound message="PAGE_NOT_FOUND" />
    return <NotFound message={error} />
  }

  return (
    <>
      {/* lg */}
      <div className='w-full max-h-dvh max-w-[70%] mx-auto md:flex hidden border-2'>
        {/* left side */}
        <div className='w-full h-auto flex-1 flex items-center justify-center'>
          <PostImage post={post} />
        </div>
        {/* right side */}
        <div className="flex max-h-[688px] flex-col justify-between w-72 flex-1 border-l">
          {/* header comment input  */}
          <CommentHeader data={post} />
          {/* body comments list  */}
          <CommentList data={post} />
          {/* footer comment input  */}
          <CommentInput data={post} />
        </div>
      </div>
      {/* sm  */}
      <div className="w-full h-full flex md:hidden flex-col">
        <AppNavbar name="Post" icon2={<div />} />
        <PostFeed post={post} />
      </div>
    </>
  )
}

export default PostPage