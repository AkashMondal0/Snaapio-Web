"use client"
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import NotFound from '@/components/Error/NotFound'
import {
  CommentHeader,
  CommentInput,
  CommentList,
} from '@/components/PostFeed/Comment'
import { ModelPostSkeleton, PostImage } from '@/components/PostFeed'
import { ImageError } from '@/components/sky'
import { RootState } from '@/redux-stores/store'
import { fetchOnePostApi } from '@/redux-stores/slice/post/api.service'


export default function Page({ params }: { params: { id: string } }) {
  const router = useRouter()
  const dispatch = useDispatch()
  const loadedRef = useRef(false)
  const postState = useSelector((Root: RootState) => Root.PostState)
  const [imageError, setImageError] = useState(false)
  const post = useMemo(() => postState.viewPost, [postState?.viewPost])

  useEffect(() => {
    if (!loadedRef.current) {
      dispatch(fetchOnePostApi({id:params.id}) as any)
      loadedRef.current = true;
    }
  }, []);

  const onOpenChange = useCallback((isOpen: boolean) => {
    if (!isOpen) {
      router.back()
    }
  }, [router])

  const onImageError = useCallback(() => {
    setImageError(true)
  }, [])

  return (
    <Dialog open onOpenChange={onOpenChange}>
      <DialogContent className="p-0 flex w-[96%] md:w-full
        overflow-y-auto md:flex-nowrap flex-wrap gap-0
        max-w-[960px] min-h-min hideScrollbar"
        style={{
          maxHeight: "95%",
          borderRadius: 20,
          margin: 5
        }}>
        {postState.viewPostLoading !== "normal" ? <ModelPostSkeleton /> :
          postState.viewPostError && loadedRef || !post ? <NotFound />
            :
            <div className='flex flex-wrap w-full'>
              <div className='flex md:flex-1 h-full w-full min-w-96 items-center'>
                {imageError ? <ImageError /> :
                  <PostImage post={post} />}
              </div>
              <div className="flex md:flex-1 h-full w-full min-w-96 flex-col justify-between border-l">
                {/* header comment input  */}
                <CommentHeader data={post} />
                {/* body comments list  */}
                {<CommentList data={post} />}
                {/* footer comment input  */}
                <CommentInput data={post} />
              </div>
            </div>
        }
      </DialogContent>
    </Dialog>
  )
}
