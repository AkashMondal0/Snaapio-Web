'use client'
import React, { useEffect, useState } from 'react'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { RootState } from '@/redux-stores/store'
import { logoutApi } from '@/redux-stores/slice/auth/api.service'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from "@/components/ui/switch"
import SkyAvatar from '@/components/sky/SkyAvatar'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import dynamic from 'next/dynamic'

const OptionAvatarDialog = dynamic(() => import('@/components/Dialog/Avatar.Options.Dialog'), { ssr: false });

const FormSchema = z.object({
    name: z.string().min(3, {
        message: "Name must be at least 3 characters.",
    }).optional(),
    username: z.string().min(3, {
        message: "Username must be at least 3 characters.",
    }).optional(),
    bio: z.string().min(3, {
        message: "Bio must be at least 3 characters.",
    }).optional(),
    website: z.array(z.string()).optional(),
});
type FormData = z.infer<typeof FormSchema>;
const Page = () => {
    const router = useRouter()
    const { setTheme, themes, theme } = useTheme()
    const session = useSelector((state: RootState) => state.AccountState.session)
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false);

    const { handleSubmit, register, reset, formState: { errors } } = useForm({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: session?.name || '',
            username: session?.username || '',
            bio: 'coming soon...',
            website: [],
        },
    });

    const onSubmit = async (inputData: FormData) => {
        // TODO : Implement Profile Update
        // try {
        //     if (!session) return toast("Something's went Wrong")
        //     const res = await dispatch(profileUpdateApi({
        //         profile: session,
        //         updateUsersInput: {
        //             name: inputData.name,
        //             username: inputData.username,
        //             bio: inputData.bio,
        //             website: inputData.website,
        //         }
        //     }) as any) as disPatchResponse<AuthorData>

        //     if (res.error) return toast("Something's went Wrong")

        //     if (res.payload) {
        //         await session.update({
        //             ...session,
        //             name: res.payload.name,
        //             username: res.payload.username,
        //             bio: res.payload.bio,
        //             website: res.payload.website,
        //         });
        //         reset({
        //             name: res.payload.name,
        //             username: res.payload.username,
        //             bio: res.payload.bio,
        //             website: res.payload.website ?? [],
        //         });
        //         toast("Profile Picture Updated")
        //     }
        // } catch (error) {
        //     toast("Something's went Wrong")
        // } finally {
        //     setLoading(false)
        // }
    }


    useEffect(() => {
        if (session) {
            reset({
                name: session.name,
                username: session.username,
                // website: session.website || [],
                // bio: session.bio,
            })
        }
    }, [session])



    if (!session) return null
    return (
        <>
            <div className='w-full flex justify-center'>
                <div className='max-w-[600px] w-full p-4 space-y-6'>
                    <h1 className="font-bold text-xl">
                        Edit Account
                    </h1>
                    <div className='flex justify-between p-4 my-4 bg-secondary text-secondary-foreground rounded-2xl'>
                        <div className='flex space-x-3'>
                            <SkyAvatar className='h-12 w-12 mx-auto' url={session?.profilePicture || null} />
                            <div>
                                <div className='font-semibold text-base'>{session?.username}</div>
                                <div className='text-sm'>
                                    {session?.name}
                                </div>
                            </div>
                        </div>
                        <div className='flex items-center'>
                            <OptionAvatarDialog>
                                <Button variant={"default"} className="rounded-xl">
                                    change photo
                                </Button>
                            </OptionAvatarDialog>

                        </div>
                    </div>
                    <div className="grid gap-2 mt-4">
                        <Label htmlFor="Username">Username</Label>
                        <Input className='p-4 rounded-2xl' id="Username" type="Username" placeholder="m@example.com" {...register("username", { required: true })} />
                        <div className="h-4 w-full text-center">
                            {errors.username ? <span className="text-red-500">{errors.username?.message}</span> : <></>}
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="Name">Name</Label>
                        <Input className='p-4 rounded-2xl' id="Name" type="Name" placeholder="Name" {...register("name", { required: true })} />
                        <div className="h-4 w-full text-center mb-2">
                            {errors.name ? <span className="text-red-500">{errors.name?.message}</span> : <></>}
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="Bio">Bio</Label>
                        <Textarea className='p-4 rounded-2xl' id="Bio" placeholder="Bio" {...register("bio", { required: true })} />
                        <div className="h-4 w-full text-center mb-2">
                            {errors.bio ? <span className="text-red-500">{errors.bio?.message}</span> : <></>}
                        </div>
                    </div>
                    {/* <div className="grid gap-2">
                        <Label htmlFor="Website">Website</Label>
                        <Input id="Website" type="Website" placeholder="Website" {...register("website", { required: true })} />
                        <div className="h-4 w-full text-center mb-2">
                            {errors.website ? <span className="text-red-500">{errors.website?.message}</span> : <></>}
                        </div>
                    </div> */}

                    {/*  */}
                    <h1 className="font-bold text-xl">
                        Figure
                    </h1>
                    <Input placeholder="Public"
                        disabled
                        className='w-full p-4 rounded-xl' />
                    <h1 className="font-bold text-xl">
                        Website
                    </h1>
                    <div>
                        <input type="text" disabled placeholder="Website"
                            className='w-full p-4 bg-secondary 
                     text-secondary-foreground rounded-2xl
                      cursor-not-allowed' />
                        <p className='text-xs my-2'>
                            Editing your links is only available on mobile. Visit the Instagram app and edit your profile to change the websites in your bio.
                        </p>
                    </div>

                    <h1 className="font-bold text-xl">
                        Switch appearance
                    </h1>
                    <Card className='p-4 rounded-2xl flex justify-between items-center'>
                        <div className='pr-4'>
                            <div className='flex gap-2 items-center text-sm font-semibold'>
                                {theme === "dark" ?
                                    <Sun /> :
                                    <Moon />}
                                {theme === "dark" ? "Light" : "Dark"} Mode</div>
                        </div>
                        <Switch onCheckedChange={() => {
                            if (theme !== "dark") {
                                setTheme("dark")
                            } else {
                                setTheme("light")
                            }
                        }} defaultChecked={theme === "dark"} />
                    </Card>

                    <h1 className="font-bold text-xl">
                        Show account suggestions on profiles
                    </h1>
                    <Card className='p-4 rounded-2xl flex justify-between items-center'>
                        <div className='pr-4'>
                            <p className='text-lg'>Show account suggestions on profiles</p>
                            <p className='text-xs opacity-80'>
                                Choose whether people can see similar account suggestions on your profile, and whether your account can be suggested on other profiles.
                            </p>
                        </div>
                        <Switch />
                    </Card>
                    <div className='flex justify-around gap-4' >
                        <Button variant={"destructive"}
                            disabled={loading}
                            onClick={logoutApi}
                            className="rounded-xl w-full">
                            logout
                        </Button>
                        <Button
                            disabled={loading}
                            type='submit'
                            onClick={handleSubmit(onSubmit)}
                            className="rounded-xl w-full">
                            Submit
                        </Button>
                        <div className='h-20'></div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Page

function SelectGender() {
    return (
        <Select>
            <SelectTrigger className="w-full rounded-2xl">
                <SelectValue placeholder="Gender" />
            </SelectTrigger>
            <SelectContent className='rounded-2xl'>
                <SelectGroup>
                    <SelectLabel>Gender</SelectLabel>
                    <SelectItem value="Male" className='rounded-2xl'>Male</SelectItem>
                    <SelectItem value="Female" className='rounded-2xl'>Female</SelectItem>
                    <SelectItem value="Other" className='rounded-2xl'>Other</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}