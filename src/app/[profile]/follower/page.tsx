"use client";
import { UserItemFollow } from '@/components/Card/UserItem';
import { LoadingUserCardWithButton } from '@/components/loading/Card';
import { Separator } from '@/components/ui/separator';
import { fetchUserProfileFollowerUserApi } from '@/redux-stores/slice/profile/api.service';
import { AuthorData, disPatchResponse, loadingType } from '@/types';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';

const Page = ({
  params
}: {
  params: { profile: string }
}) => {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState<loadingType>('idle')
  const [error, setError] = useState<string | null>(null)
  const Users = useRef<AuthorData[]>([])
  const usersFetched = useRef(false)

  const fetchPosts = useCallback(async () => {
    if (loading === "pending") return
    setLoading("pending")
    try {
      const res = await dispatch(fetchUserProfileFollowerUserApi({
        id: params.profile,
        offset: 0,
        limit: 20
      }) as any) as disPatchResponse<AuthorData[]>
      if (res.error) {
        toast.error(res?.error?.message || "An error occurred")
        setError(res?.error?.message || "An error occurred")
        return
      }
      if (res.payload.length <= 0) {
        usersFetched.current = true
        return
      }
      Users.current.push(...res.payload)
    } finally {
      setLoading("normal")
    }
  }, [loading, Users.current, params.profile])


  useEffect(() => {
    fetchPosts()
  }, []);

  if (error) {
    return <>error followerList</>
  }

  return (
    <div className='w-full flex justify-center min-h-[100dvh] h-full'>
      <div className='max-w-[600px] w-full p-4'>
        <h1 className="font-semibold text-lg text-center mb-4">Followers</h1>
        <Separator />
        <div className='h-5' />
        {loading === "normal" ?
          <>
            {Users.current?.map((user, i) => <UserItemFollow
              showRemoveButton
              key={i} user={user} />)}
          </> :
          <>{Array(10).fill(0).map((_, i) => <LoadingUserCardWithButton key={i} />)}</>}
      </div>
    </div>
  )
}

export default Page