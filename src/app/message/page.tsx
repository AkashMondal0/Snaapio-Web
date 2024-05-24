import { configs } from '@/configs';
import { RestApiPayload } from '@/types';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import React from 'react'


async function getProfileChatListApi(id: string) {
  try {
    const response = await fetch(`${configs.appUrl}/api/v1/profile/${id}`, {
      headers: {
        "Content-Type": "application/json",
        "authorization": `${cookies().get("token-auth")?.value}`
      },
      cache: "no-store"
    });
    const res = await response.json() as RestApiPayload<{}>;
    if (res.code === 0) {
      throw new Error(res.message);
    }
    return res.data;
  } catch (error) {
    console.log(error)
    return notFound()
  }
}



const Page = () => {

  return (
    <>
      Your messages
      <div>Send a message to start a chat.</div>
    </>
  )
}

export default Page
