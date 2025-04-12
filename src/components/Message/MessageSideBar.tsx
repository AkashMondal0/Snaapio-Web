/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { memo, useEffect, useMemo, useState } from 'react'
import { CardTitle } from '../ui/card';
import { ServerCrash, SquarePen } from 'lucide-react';
import { Button } from '../ui/button';
import UserToMessage from '@/components/Dialog/UserToMessage.Dialog';
import { useDispatch, useSelector } from 'react-redux';
import { NavigationBottom } from '@/components/Navigation';
import { VirtualUserList } from './VirtualUserList';
import { MessagePageSidebarSkeleton } from './MessageSkeleton';
import { RootState } from '@/redux-stores/store';
import { fetchConversationsApi } from '@/redux-stores/slice/conversation/api.service';
import searchText from '@/lib/TextSearch';
let pageLoaded = false

const MessageSideBar = memo(function MessageSideBar() {
    const list = useSelector((Root: RootState) => Root.ConversationState.conversationList) || []
    const loading = useSelector((Root: RootState) => Root.ConversationState.listLoading)
    const error = useSelector((Root: RootState) => Root.ConversationState.listError)

    const [inputText, setInputText] = useState("")
    const dispatch = useDispatch()

    const conversationList = useMemo(() => {
        return [...list].sort((a, b) => {
            if (a.lastMessageCreatedAt && b.lastMessageCreatedAt) {
                return new Date(b.lastMessageCreatedAt).getTime() - new Date(a.lastMessageCreatedAt).getTime()
            }
            return 0
        })
            .filter((item) => item.lastMessageCreatedAt !== null)
            .filter((item) => searchText(item?.user?.name, inputText))
    }, [list, inputText])

    useEffect(() => {
        if (!pageLoaded) {
            dispatch(fetchConversationsApi({
                offset: 0,
                limit: 16
            }) as any)
            pageLoaded = true
        }
    }, [])

    // console.log(conversationList)

    if (loading !== "normal") {
        return <MessagePageSidebarSkeleton />
    }

    if (error && pageLoaded) {
        return <div className='md:border-r scroll-smooth flex justify-center items-center text-center
        duration-300 bg-background text-foreground h-dvh md:w-96 ease-in-out w-full mx-auto flex-col'>
            <ServerCrash className='w-16 h-16' />
            <CardTitle>Server Error</CardTitle>
        </div>
    }

    return (
        <div className={`flex flex-col md:border-r scroll-smooth 
            duration-300 bg-background text-foreground h-dvh md:w-96 ease-in-out w-full`}>
            <VirtualUserList
                conversation={conversationList}
                Header={<Header />} />
            <NavigationBottom />
        </div>
    )
}, (() => true))
export default MessageSideBar;
const Header = memo(function Header() {

    return <div className='w-full p-4 pb-0 sticky top-0 bg-background z-50'>
        <div className="flex justify-between w-full items-center">
            <CardTitle>Snaapio</CardTitle>
            <div>
                <UserToMessage>
                    <Button variant={"ghost"} className='rounded-2xl w-8 h-8 p-1'>
                        <SquarePen className='cursor-pointer' />
                    </Button>
                </UserToMessage>

            </div>
        </div>
        <div className="flex items-center justify-between py-3 w-full">
            <div className='font-semibold'>Message</div>
            <div className='text-gray-500 text-sm'>Requests</div>
        </div>
    </div>
}, (() => true))