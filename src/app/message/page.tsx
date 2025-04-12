/* eslint-disable @next/next/no-img-element */
import React from 'react'
import { configs } from '@/configs';
import dynamic from 'next/dynamic';

const LinkButton = dynamic(() => import('@/components/ui/LinkButton').then(mod => mod.LinkButton), { ssr: false });
const MessageSideBar = dynamic(() => import('@/components/Message').then(mod => mod.MessageSideBar), { ssr: false });
const NavigationSidebar = dynamic(() => import('@/components/Navigation').then(mod => mod.NavigationSidebar), { ssr: false });

export default function Page() {
  return (
    <>
      <div className='w-full h-full flex'>
        <div className='h-dvh flex w-max flex-1'>
          <NavigationSidebar hideLabel />
          <MessageSideBar />
        </div>
        <div className='w-full justify-center hidden md:flex items-center'>
          <div className='text-center'>
            <img src={configs.AppDetails.logoUrl}
              alt='Empty chat'
              className='w-40 h-40 mx-auto' width={200} height={200} />
            <p className='text-xl font-semibold'>Your messages</p>
            <p>Send a message to start a chat.</p>
            <LinkButton href={"#"} className='mt-4 rounded-xl'>
              Start a chat
            </LinkButton>
          </div>
        </div>
      </div>

    </>
  )
}
