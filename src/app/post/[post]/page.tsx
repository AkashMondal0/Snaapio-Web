"use client"
import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux-stores/store'
import { fetchOnePostApi } from '@/redux-stores/slice/post/api.service'
import dynamic from 'next/dynamic'
const NotFound = dynamic(() => import('@/components/Error/NotFound'), { ssr: false })
const ModelPostSkeleton = dynamic(() => import('@/components/PostFeed').then(mod => mod.ModelPostSkeleton), { ssr: false })
const PostFeed = dynamic(() => import('@/components/PostFeed').then(mod => mod.PostFeed), { ssr: false })
const PostFeedSkeleton = dynamic(() => import('@/components/PostFeed').then(mod => mod.PostFeedSkeleton), { ssr: false })
const PostImage = dynamic(() => import('@/components/PostFeed').then(mod => mod.PostImage), { ssr: false })
const CommentHeader = dynamic(() => import('@/components/PostFeed/Comment').then(mod => mod.CommentHeader), { ssr: false })
const CommentInput = dynamic(() => import('@/components/PostFeed/Comment').then(mod => mod.CommentInput), { ssr: false })
const CommentList = dynamic(() => import('@/components/PostFeed/Comment').then(mod => mod.CommentList), { ssr: false })
const AppNavbar = dynamic(() => import('@/components/Header/Header').then(mod => mod.AppNavbar), { ssr: false })

const PostPage = ({ params }: { params: { post: string } }) => {
  const dispatch = useDispatch()
  const post = useSelector((Root: RootState) => Root.PostState.viewPost)
  const loading = useSelector((Root: RootState) => Root.PostState.viewPostLoading)
  const error = useSelector((Root: RootState) => Root.PostState.viewPostError)

  const loadedRef = useRef(false)

  useEffect(() => {
    if (!loadedRef.current) {
      dispatch(fetchOnePostApi({ id: params.post }) as any)
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