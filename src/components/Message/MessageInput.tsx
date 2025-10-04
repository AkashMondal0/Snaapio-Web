'use client';
import { memo, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2Icon, Paperclip, PlusCircle, Send } from 'lucide-react'
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form'
import { debounce } from 'lodash';
import { useDispatch, useSelector } from 'react-redux'
import { Conversation } from '@/types';
import { SocketContext } from '@/provider/Socket_Provider';
import { event_name } from '@/configs/socket.event';
import { toast } from 'sonner';
import { FileUploadMenu } from '../Option/FileUploadMenu';
import { UploadFileList } from './MessageUploadFile';
import { RootState } from '@/redux-stores/store';
import { CreateMessageApi, fetchConversationsApi } from '@/redux-stores/slice/conversation/api.service';

const dropdownData = [
    {
        label: "Photo",
        onClick: () => document?.getElementById('files')?.click()
    },
    // {
    //     label: "Document",
    //     onClick: () => { }
    // }
]
const schema = z.object({
    message: z.string().min(1)
})
export const MessageInput = memo(function MessageInput({ data }: { data: Conversation }) {
    const dispatch = useDispatch()
    const ConversationList = useSelector((state: RootState) => state.ConversationState.conversationList, (prev, next) => prev.length === next.length)
    const session = useSelector((Root: RootState) => Root.AccountState.session)
    const [isFile, setIsFile] = useState<File[]>([])
    const [loading, setLoading] = useState(false)
    const socketState = useContext(SocketContext)
    const stopTypingRef = useRef(true)
    const members = useMemo(() => {
        return data.members?.filter((i) => i !== session?.id) ?? []
    }, [data.members, session?.id])

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            message: "",
        }
    });

    const typingSetter = useCallback((typing: boolean) => {
        if (session?.id && data.id) {
            socketState.socket?.emit(event_name.conversation.typing, {
                typing: typing,
                authorId: session?.id,
                members: members,
                conversationId: data.id,
                isGroup: data.isGroup ?? false
            })
        }
    }, [data.id, data.isGroup, members, session?.id, socketState.socket]);

    const onBlurTyping = debounce(() => {
        stopTypingRef.current = true
        typingSetter(false)
    }, 2500);

    const onTyping = useCallback(() => {
        if (stopTypingRef.current) {
            typingSetter(true)
            stopTypingRef.current = false
        }
        onBlurTyping()
    }, []);

    const sendMessageHandle = useCallback(async (_data: { message: string }) => {
        setLoading(true)
        try {
            if (!session?.id || !data.id) return toast.error("Something went wrong")
            if (isFile.length > 6) return toast.error("You can only send 6 files at a time")
            const newMessage = await dispatch(CreateMessageApi({
                conversationId: data.id,
                authorId: session?.id,
                content: _data.message,
                fileUrl: isFile,
                members: members,
                membersPublicKey: data.membersPublicKey
            }) as any)
            if (newMessage?.payload?.id) {
                socketState.socket?.emit(event_name.conversation.message, {
                    ...newMessage.payload, members: members
                })
            }
            if (ConversationList.findIndex((i) => i.id === data.id) === -1 && data.id) {
                // toast.success("New conversation created")
                dispatch(fetchConversationsApi({
                    limit: 16,
                    offset: 0
                }) as any)
            }
            reset()
            setIsFile([])
        } catch (error) {
            toast.error("Something went wrong")
        } finally {
            setLoading(false)
        }
    }, [ConversationList, data.id, isFile, members, session?.id, socketState.socket])

    const onChangeFilePicker = useCallback((event: any) => {
        let files = [...event.target.files]
        isFile.map((file) => {
            files = files.filter((f) => f.name !== file.name)
        })
        setIsFile((prev) => [...prev, ...files])
    }, [isFile])

    const onRemoveItem = useCallback((id: string) => {
        setIsFile((prev) => prev.filter((i) => i.name !== id))
    }, [])

    const onAddItem = useCallback(() => {
        document?.getElementById('files')?.click()
    }, [])

    return (
        <>
            <div className={`w-full border-t items-center
             h-auto my-auto gap-1 sticky py-2 px-1
             bottom-0 z-50 bg-background`}>
                <UploadFileList assets={isFile} addItem={onAddItem} removeItem={onRemoveItem} />
                {/* input */}
                <div className='flex gap-2'>
                    <FileUploadMenu data={dropdownData}>
                        <Button type="submit"
                            variant={"outline"}
                            className='rounded-3xl p-0 w-12'>
                            <Paperclip />
                        </Button>
                    </FileUploadMenu>
                    <input
                        type="file"
                        accept="image/*"
                        // accept="image/*, video/*, audio/*"
                        multiple
                        name="file"
                        id="files"
                        className='hidden'
                        onChange={(e) => { onChangeFilePicker(e) }} />
                    <form onSubmit={handleSubmit(sendMessageHandle)}
                        className="flex w-full items-center dark:bg-neutral-900 bg-neutral-200 dark:text-neutral-100 text-neutral-800 rounded-3xl">
                        <input id='message-input' className='outline-none focus:none bg-transparent w-full p-2 dark:placeholder-neutral-100 placeholder-neutral-800'
                            type="text" placeholder="Send a message"
                            {...register("message", {
                                required: true,
                                onChange: onTyping,
                            })}
                        />
                    </form>
                    <Button type="submit"
                        disabled={loading}
                        onClick={handleSubmit(sendMessageHandle)}
                        variant={"outline"}
                        className='rounded-3xl h-10 px-3'>
                        {loading ? <Loader2Icon className='animate-spin' /> : <Send />}
                    </Button>
                </div>
            </div>
        </>
    );
}, ((preProps, nestProps) => {
    return preProps.data.id === nestProps.data.id
}))
