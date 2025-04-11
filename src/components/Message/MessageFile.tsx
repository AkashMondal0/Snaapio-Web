import React from 'react'
import OptimizedImage from '../sky/SkyImage'
import { Message } from '@/types'
import { CheckCheck } from 'lucide-react'
import ViewImageDialog from '../Dialog/ViewImage.Dialog'

const MessageFile = ({
  data,
  isProfile,
  seen
}: {
  data: Message,
  isProfile?: boolean
  seen?: boolean
}) => {

  if (data?.fileUrl.length >= 4) {
    return <>
      <div className={`p-1 my-1 rounded-2xl border ${isProfile ? "bg-primary/90 text-primary-foreground" : "bg-accent"}`}>
        <ViewImageDialog photos={data?.fileUrl}>
          <div className='flex justify-end items-end'>
            <div className='w-80 h-80 grid grid-cols-2 gap-1'>
              {data?.fileUrl?.slice(0, 4).map((asset, index) => (
                <div key={index} className='flex justify-center items-center h-full w-full'>
                  {data?.fileUrl.length > 4 && index === 3 ?
                    <div className='bg-black/40 text-white flex justify-center items-center
                    cursor-pointer
                     text-4xl absolute rounded-xl w-[9.9rem] h-[9.9rem] font-sans'>
                      {`+${data?.fileUrl.length - 4}`}
                    </div> : <></>}
                  <OptimizedImage
                    className={'h-auto w-auto aspect-square object-cover rounded-xl'}
                    src={asset?.original} alt="image" width={100} height={100} />
                </div>
              ))}
            </div>
            {/* mark as seen */}
            <div className='flex justify-end gap-2 mt-[2px] w-0 shadow-2xl'>
              <div className='w-max flex px-1'>
                <div className={`text-sm text-white w-max`}>
                  {new Date(data.createdAt as Date).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}
                </div>
                {isProfile ? <div className='text-sm text-white'>
                  <CheckCheck size={20} className={seen ? 'text-sky-400' : ""} />
                </div> : null}
              </div>
            </div>
          </div>
        </ViewImageDialog>
      </div>
    </>
  }

  return <div>
    {data?.fileUrl?.map((asset, index) => {
      if (asset.type === "image") {
        return <div
          key={index}
          className={`p-1 my-1 rounded-2xl border ${isProfile ? "bg-primary/90 text-primary-foreground" : "bg-accent"}`}>
          <ViewImageDialog photos={data.fileUrl}>
            <div className='flex justify-end items-end'>
              <OptimizedImage
                key={index}
                className='max-h-96 w-72 object-cover rounded-xl'
                  src={asset?.original} alt="image" width={100} height={100} />
              <div className='flex justify-end gap-2 mt-[2px] w-0 shadow-2xl'>
                <div className='w-max flex px-1'>
                  <div className={`text-sm text-white w-max`}>
                    {new Date(data.createdAt as Date).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}
                  </div>
                  {isProfile ? <div className='text-sm text-white'>
                    <CheckCheck size={20} className={seen ? 'text-sky-400' : ""} />
                  </div> : null}
                </div>
              </div>
            </div>
          </ViewImageDialog>
        </div>
      }
      // if (asset) {
      //   return <video src={asset.url} controls key={index} className={`object-cover h-60 w-48 rounded-3xl mb-2`} />
      // }
      // if (asset) {
      //   return <audio key={index} src={asset.url} controls className={`object-cover h-60 w-48 rounded-3xl mb-2`} />
      // }
      return <></>
    })}
  </div>
}

export default MessageFile