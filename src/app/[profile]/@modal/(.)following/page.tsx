'use client'
import { useRouter } from 'next/navigation'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { LoadingUserCardWithButton } from "@/components/loading/Card"
import { UserItemFollow } from "@/components/Card/UserItem"
import { TempleDialog } from "@/components/Dialog/Temple.Dialog"
import { fetchUserProfileFollowingUserApi } from '@/redux-stores/slice/profile/api.service'
import { AuthorData, disPatchResponse, loadingType } from '@/types'
import { toast } from 'sonner'
const Page = ({
  params
}: {
  params: { profile: string }
}) => {
  const dispatch = useDispatch()
    const router = useRouter()
    const [loading, setLoading] = useState<loadingType>('idle')
    const [error, setError] = useState<string | null>(null)
    const Users = useRef<AuthorData[]>([])
    const usersFetched = useRef(false)

    const fetchPosts = useCallback(async () => {
        if (loading === "pending") return
        setLoading("pending")
        try {
            const res = await  dispatch(fetchUserProfileFollowingUserApi({
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


  const onOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      router.back()
    }
  }
  return (

    (<TempleDialog
      open
      onOpenChange={onOpenChange}
      headerTitle={'Following'}>
      {loading === "normal" ?
            Users.current?.map((user, i) => <UserItemFollow key={i} user={user} />) :
            Array(10).fill(0).map((_, i) => <LoadingUserCardWithButton key={i} />)}
    </TempleDialog>)
  )
}

export default Page


