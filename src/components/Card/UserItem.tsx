import SkyAvatar from '@/components/sky/SkyAvatar'
import { Button } from '@/components/ui/button'
import { AuthorData, disPatchResponse } from '@/types'
import React, { useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FollowerRemoveDialog, UnFollowDialog } from '@/components/Dialog/Follow.Dialog'
import { useParams, useRouter } from 'next/navigation'
import { RemoveFriendshipApi, createFriendshipApi, destroyFriendshipApi } from '@/redux-stores/slice/profile/api.service'
import { RootState } from '@/redux-stores/store'

export const UserItemFollow = ({
    user,
    showRemoveButton = false
}: {
    user?: AuthorData
    showRemoveButton?: boolean
}) => {
    const session = useSelector((state: RootState) => state.AccountState.session)
    const dispatch = useDispatch()
    const params = useParams()
    const router = useRouter()
    const [userData, setUserData] = useState(user)
    const [removed, setRemoved] = useState(false)
    const loadingRef = useRef(false)

    const isProfile = useMemo(() => {
        if (!session || !user) return false
        return session?.id === user?.id
    }, [session?.id, user?.id])

    const handleUnFollow = async () => {
        if (loadingRef.current) return
        loadingRef.current = true
        if (!session?.id) return alert('no user id from unfollow button')
        if (!user?.id) return alert('no user id from unfollow button')
        const res = await destroyFriendshipApi({
            authorUserId: session?.id,
            authorUsername: session?.username,
            followingUserId: user?.id,
            followingUsername: user?.username
        })
        if (userData && res) {
            setUserData({
                ...userData,
                following: false
            })
        } else {
            alert('Something went Wrong')
        }
        loadingRef.current = false
    }

    const handleFollow = async () => {
        if (loadingRef.current) return
        loadingRef.current = true
        if (!session?.id) return alert('no user id from follow button')
        if (!user?.id) return alert('no user id from follow button')
        const res = await createFriendshipApi({
            authorUserId: session?.id,
            authorUsername: session?.username,
            followingUserId: user?.id,
            followingUsername: user?.username,
        })

        if (userData && res) {
            setUserData({
                ...userData,
                following: true
            })
        } else {
            alert('Something went Wrong')
        }
        loadingRef.current = false
    }

    const handleRemoveFollow = async () => {
        if (loadingRef.current) return
        loadingRef.current = true
        if (!session?.id) return alert('no user id from follow button')
        if (!user?.id) return alert('no user id from follow button')
        const res = await RemoveFriendshipApi({
            authorUserId: user?.id,
            authorUsername: user?.username,
            followingUserId: session?.id,
            followingUsername: session?.username
        })

        if (res) {
            setRemoved(true)
        } else {
            alert('Something went Wrong')
        }
        loadingRef.current = false
    }

    const HandleRejected = () => { }
    return (
        <>
            <div className='flex justify-between my-4 flex-wrap space-y-4'>
                <div className='flex items-center cursor-pointer flex-none gap-1' onClick={() => { router.push(`/${user?.username}`) }}>
                    <div>
                        <SkyAvatar url={user?.profilePicture} className='h-12 w-12 aspect-square object-cover' />
                    </div>
                    <div className='max-w-60 truncate shrink'>
                        <div className='font-semibold text-base truncate'>{user?.username}</div>
                        <div className='text-sm truncate'>
                            {user?.email}
                        </div>
                    </div>
                </div>
                <div className='flex items-center gap-2 flex-wrap justify-end'>
                    {isProfile ? <>You</> :
                        <>
                            {userData?.following ?
                                <UnFollowDialog
                                    HandleConfirm={handleUnFollow}
                                    HandleRejected={HandleRejected}
                                    user={userData}>
                                    <Button
                                        disabled={loadingRef.current}
                                        variant={"secondary"} className=" rounded-xl">
                                        following
                                    </Button>
                                </UnFollowDialog>
                                :
                                <Button
                                    disabled={loadingRef.current}
                                    onClick={handleFollow}
                                    variant={"default"} className=" rounded-xl">
                                    follow
                                </Button>}
                        </>}
                    {!removed && showRemoveButton && userData?.followed_by && params.profile === session?.username &&
                        <FollowerRemoveDialog
                            user={userData}
                            HandleRejected={HandleRejected}
                            HandleConfirm={handleRemoveFollow}>
                            <Button variant={"destructive"} className="rounded-xl text-white">
                                Remove
                            </Button>
                        </FollowerRemoveDialog>}
                </div>
            </div>
        </>
    )
}
