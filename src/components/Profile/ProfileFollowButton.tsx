"use client"
import { Button } from "@/components/ui/button"
import { Conversation, User, disPatchResponse } from "@/types"
import { useRouter } from "next/navigation"
import { memo, useCallback, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { EllipsisVertical } from "../sky/icons"
import { toast } from "sonner"
import { RootState } from "@/redux-stores/store"
import { createFriendshipApi, destroyFriendshipApi } from "@/redux-stores/slice/profile/api.service"
import { CreateConversationApi } from "@/redux-stores/slice/conversation/api.service"

const ProfileFollowButton = memo(function FollowButton({
    user,
    isProfile
}: {
    user: User
    isProfile: boolean
}) {
    const session = useSelector((Root: RootState) => Root.AccountState.session)
    const router = useRouter()
    const dispatch = useDispatch()
    const [state, setState] = useState({
        isFollowing: user.friendship?.following,
        isFollower: user.friendship?.followed_by,
        loading: false,
    })

    const handleFollow = useCallback(async () => {
        if (state.loading) return
        setState({ ...state, loading: true })
        try {
            if (!session?.id) return toast('You are not logged in')
            if (!user?.id) return toast('User id issue')
            const res = await createFriendshipApi({
                authorUserId: session?.id,
                authorUsername: session?.username,
                followingUserId: user?.id,
                followingUsername: user?.username,
            }) as unknown as disPatchResponse<any>
            if (res) {
                setState((prev) => ({ ...prev, isFollowing: true }))
            } else {
                toast("Something's went Wrong")
            }
        }
        finally {
            setState((prev) => ({ ...prev, loading: false }))
        }
    }, [isProfile, session?.id, user?.id])

    const handleUnFollow = useCallback(async () => {
        if (state.loading) return
        setState({ ...state, loading: true })
        try {
            if (!session?.id) return toast('You are not logged in')
            if (!user?.id) return toast('User id issue')
            const res = await destroyFriendshipApi({
                authorUserId: session?.id,
                authorUsername: session?.username,
                followingUserId: user?.id,
                followingUsername: user?.username
            }) as unknown as disPatchResponse<boolean>
            if (res) {
                setState((prev) => ({ ...prev, isFollowing: false }))
            } else {
                alert("Something's went Wrong")
            }
        } finally {
            setState((prev) => ({ ...prev, loading: false }))
        }
    }, [isProfile, session?.id, user?.id])

    const messagePageNavigate = useCallback(async () => {
        if (state.loading) return
        try {
            if (!session?.id) return toast('You are not logged in')
            if (!user?.id || user?.id === session?.id) return toast("Something went wrong")
            const res = await dispatch(CreateConversationApi([user, session]) as any) as disPatchResponse<Conversation>
            if (res.error) return toast("Something went wrong")
            router.push(`/message/${res.payload.id}`)
        } catch (error) {
            toast("Something went wrong")
        } finally {
            setState((prev) => ({ ...prev, loading: false }))
        }
    }, [isProfile, session?.id, user])

    if (!user) return <div></div>

    if (!session && user.friendship) {
        return (<>
            <div className='md:flex space-x-2 space-y-2 items-center'>
                <div className="flex items-center">
                    <p className='text-xl px-3 line-clamp-1'>{user.username}</p>
                </div>

                <Button variant={"secondary"} disabled={state.loading} className='rounded-xl' onClick={() => {
                    router.push(`/auth/login?callback=${user.username}`)
                }}>
                    Follow
                </Button>
            </div>
        </>)
    }

    if (isProfile) {
        return <div className='md:flex space-x-2 space-y-2 items-center'>
            <div className="flex items-center">
                <p className='text-xl px-3 line-clamp-1'>{user.username}</p>
            </div>

            <Button variant={"secondary"} disabled={state.loading} className='rounded-xl' onClick={() => {
                router.push('/account/edit')
            }}>
                Edit Profile
            </Button>
            <Button variant={"secondary"} disabled={state.loading} className='rounded-xl' onClick={() => {
                router.push('/account/archive')
            }}>
                View Archive
            </Button>
            <div className="w-7 h-7 cursor-pointer hidden md:block">
                {EllipsisVertical('w-full h-full')}
            </div>
        </div>
    }

    return <div className='items-center md:flex space-x-2 space-y-2'>
        <div className="flex items-center">
            <p className='text-xl px-3 line-clamp-1'>{user.username}</p>
        </div>
        {state.isFollowing ?
            <Button className='rounded-xl px-6 w-24' variant={"secondary"} disabled={state.loading} onClick={handleUnFollow}>
                Following
            </Button> :
            <Button className='rounded-xl px-6 w-24' disabled={state.loading} onClick={handleFollow}>
                Follow
            </Button>}
        <Button variant={"secondary"} className='rounded-xl' disabled={state.loading}
            onClick={messagePageNavigate}>
            Message
        </Button>
        <div className="w-7 h-7 cursor-pointer hidden md:block">
            {EllipsisVertical('w-full h-full')}
        </div>
    </div>
}, ((prevProps, nextProps) => prevProps.isProfile === nextProps.isProfile && prevProps.user.id === nextProps.user.id))

export default ProfileFollowButton