"use client"
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual';
import { Loader2 } from 'lucide-react';
import { debounce } from 'lodash';
import { useDispatch, useSelector } from "react-redux"
import { Conversation, Message, disPatchResponse } from "@/types";
import { toast } from "sonner";
import { RootState } from '@/redux-stores/store';
import { fetchConversationAllMessagesApi, fetchConversationApi } from '@/redux-stores/slice/conversation/api.service';
import dynamic from 'next/dynamic';

const NotFound = dynamic(() => import("@/components/Error/NotFound"), { ssr: false });
const MessageHeader = dynamic(() => import("@/components/Message").then(mod => mod.MessageHeader), { ssr: false });
const MessageInput = dynamic(() => import("@/components/Message").then(mod => mod.MessageInput), { ssr: false });
const MessagePageSkeleton = dynamic(() => import("@/components/Message").then(mod => mod.MessagePageSkeleton), { ssr: false });
const MessageSideBar = dynamic(() => import("@/components/Message").then(mod => mod.MessageSideBar), { ssr: false });
const NavigationSidebar = dynamic(() => import("@/components/Message").then(mod => mod.NavigationSidebar), { ssr: false });
const MessageItem = dynamic(() => import("@/components/Message").then(mod => mod.MessageItem), { ssr: false });

let pageId = 'no id'
let totalFetchedItemCount: number | null = 0

export default function Page({ params }: { params: { id: string } }) {
  const [mounted, setMounted] = useState(false)

  const dispatch = useDispatch()
  const ConversationData = useSelector((Root: RootState) => Root.ConversationState.conversation, (prev, next) => prev?.id === next?.id)
  const ConversationLoading = useSelector((Root: RootState) => Root.ConversationState.loading)
  const ConversationError = useSelector((Root: RootState) => Root.ConversationState.error)

  const Messages = useSelector((Root: RootState) => Root.ConversationState?.messages)
  const MessagesLoading = useSelector((Root: RootState) => Root.ConversationState.messageLoading)
  const MessagesError = useSelector((Root: RootState) => Root.ConversationState.messageError)

  const session = useSelector((Root: RootState) => Root.AccountState.session)
  const parentRef = useRef<HTMLDivElement>(null)
  const count = useMemo(() => Messages?.length, [Messages])
  const stopFetch = useRef(false)
  const stopBottomRef = useRef(true)

  const loadMoreMessages = useCallback(async (conversationId?: string) => {
    if (totalFetchedItemCount === null) return
    if (!conversationId) return toast.error('Something went wrong')
    try {
      const resM = await dispatch(fetchConversationAllMessagesApi({
        id: params.id,
        offset: totalFetchedItemCount,
        limit: 20
      }) as any) as disPatchResponse<Message[]>
      if (resM?.error) return toast.error('Error loading messages')
      if (resM.payload.length >= 20) {
        totalFetchedItemCount += 20
        virtualizer.scrollToIndex(resM.payload.length + (virtualizer?.range?.endIndex ?? 0))
        return
      }
      totalFetchedItemCount = null
    } finally {
      stopFetch.current = false
    }
  }, [params.id])

  const fetchConversation = useCallback(async () => {
    const res = await dispatch(fetchConversationApi(params.id) as any) as disPatchResponse<Conversation>
    if (!res.payload.id || res.error) return toast.error('Error loading conversation')
    loadMoreMessages(params.id)
  }, [params.id])

  const fetchMore = debounce(() => {
    loadMoreMessages(params.id)
  }, 1000)

  // 
  const virtualizer = useVirtualizer({
    count,
    getScrollElement: () => parentRef.current,
    estimateSize: useCallback(() => 200, []),
    overscan: 30,
    onChange: (virtualizer) => {
      if (!virtualizer?.range || !virtualizer.isScrolling) return
      if (virtualizer?.range?.startIndex <= 3
        && virtualizer?.scrollDirection === "backward"
        && !stopFetch.current
        && totalFetchedItemCount !== null
      ) {
        stopFetch.current = true
        stopBottomRef.current = false
        fetchMore()
      }
      if (virtualizer?.range?.endIndex !== count - 1
        && virtualizer?.scrollDirection === "backward"
        && stopBottomRef.current) {
        stopBottomRef.current = false
      }
      if (virtualizer?.range?.endIndex === count - 1
        && virtualizer?.scrollDirection === "forward"
        && !stopBottomRef.current) {
        stopBottomRef.current = true
      }
    },
  })

  const items = virtualizer.getVirtualItems()

  useEffect(() => {
    // console.log('scrolling to bottom')
    if (Messages.length > 0 && stopBottomRef.current && !virtualizer.isScrolling) {
      const totalHeight = virtualizer.getTotalSize()
      virtualizer.scrollToOffset(totalHeight);
    }
  }, [Messages.length, virtualizer]);

  useEffect(() => {
    if (!mounted) setMounted(true)
    if (pageId !== params.id) {
      fetchConversation()
      pageId = params.id
      totalFetchedItemCount = 0
    }
  }, [params.id])

  if (!mounted) return <></>

  return (
    <div className='flex'>
      <div className='h-dvh hidden md:flex'>
        <NavigationSidebar hideLabel />
        <MessageSideBar />
      </div>
      {/*  */}
      {ConversationLoading ? <MessagePageSkeleton /> :
        !ConversationData || ConversationError ? <NotFound /> :
          <div className='w-full flex flex-col min-h-dvh flex-1'>
            <MessageHeader data={ConversationData} />
            <>
              <div ref={parentRef}
                className='h-full w-full flex-1 hideScrollbar' id='style-1'
                style={{
                  height: "100%",
                  width: '100%', overflowY: 'auto', contain: 'strict'
                }}>
                {/* {Header} */}
                <div
                  style={{
                    height: virtualizer.getTotalSize(),
                    width: '100%',
                    position: 'relative',
                  }}>
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      padding: 4,
                      transform: `translateY(${items[0]?.start ?? 0}px)`,
                    }}>
                    <div className='w-full'>
                      {!MessagesLoading ? <></> : <Loader2 className="animate-spin w-12 h-12 mx-auto my-5 text-accent" />}
                    </div>
                    {items.map((virtualRow) => (
                      <div key={virtualRow.key}
                        // className='outline outline-red-500'
                        data-index={virtualRow.index}
                        ref={virtualizer.measureElement}>
                        {/* <>{virtualRow.index}</> */}
                        <MessageItem
                          key={virtualRow.index}
                          data-index={virtualRow.index}
                          seen={ConversationData?.messagesAllRead ? true :
                            Messages[virtualRow.index].seenBy.length === ConversationData?.members.length}
                          isProfile={session?.id === Messages[virtualRow.index].authorId}
                          data={Messages[virtualRow.index]} />
                      </div>
                    ))}
                  </div>
                </div>
                {/* {Footer} */}
              </div>
            </>
            <MessageInput data={ConversationData} />
          </div>}
    </div>
  )
}