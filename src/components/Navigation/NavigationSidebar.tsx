/* eslint-disable @next/next/no-img-element */
"use client"
import { cn } from "@/lib/utils"
import {
    Compass,
    CopyPlus, Film,
    Heart, Home, Menu,
    MessageCircleCode,
    Search
} from "lucide-react"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import React, { memo, useCallback, useMemo } from "react"
import { useRouter } from "next/navigation"
import MoreDropdownMenu from "@/components/Option/HomePageMenu"
import { configs } from "@/configs"
import { NotificationPopup, NotificationPing, NotificationIndicator } from "../Alert"
import { useDispatch, useSelector } from "react-redux"
import NotificationSidebar from "../Sidebar/NotificationSidebar"
import SearchSidebar from "../Sidebar/SearchSidebar"
import UploadPostDialog from "../Dialog/UploadPost.Dialog"
import { RootState } from "@/redux-stores/store"
import { toggleCreatePostModal, toggleNotificationSidebar, toggleSearchSidebar } from "@/redux-stores/slice/sidebar"
import { OptimizedImage, SkyAvatar } from "../sky"

// for large screen device 
const NavigationSidebar = memo(function NavigationSidebar({
    hideLabel = false,
    isHideNav = false,
}: {
    hideLabel?: boolean
    isHideNav?: boolean,
}) {
    const Sidebar = useSelector((state: RootState) => state.SidebarState)
    const session = useSelector((state: RootState) => state.AccountState.session)
    const router = useRouter()
    const dispatch = useDispatch()
    const pageChange = useCallback((path: string) => router.push(path), [router])
    const hideLabelClass = useMemo(() => {
        if (
            hideLabel ||
            Sidebar.notificationSidebar ||
            Sidebar.searchSidebar
        ) return true
    }, [hideLabel, Sidebar.notificationSidebar, Sidebar.searchSidebar])
    const SideIconData = [
        {
            icon: <Home className="w-full h-full p-[2px]" />,
            label: "Home",
            onClick: () => pageChange('/')
        },
        {
            icon: <Search className="w-full h-full p-[2px]" />,
            label: "Search",
            onClick: () => { dispatch(toggleSearchSidebar()) }
        },
        {
            icon: <Compass className="w-full h-full p-[2px]" />,
            label: "Explore",
            onClick: () => pageChange('/explore')
        },
        {
            icon: <Film className="w-full h-full p-[2px]" />,
            label: "Reels",
            onClick: () => pageChange('/reels/5')
        },
        {
            icon: <MessageCircleCode className="w-full h-full p-[2px]" />,
            label: "Messages",
            onClick: () => pageChange('/message'),
            countIndicatorComponent: <NotificationPing />
        },
        {
            icon: <Heart className="w-full h-full p-[2px]" />,
            label: "Notifications",
            onClick: () => { dispatch(toggleNotificationSidebar()) },
            popupIndicatorComponent: <NotificationPopup />,
            indicatorComponent: <NotificationIndicator />
        },
        {
            icon: <UploadPostDialog>
                <CopyPlus className="w-full h-full p-[2px]" />
            </UploadPostDialog>,
            label: "Create",
            onClick: () => { dispatch(toggleCreatePostModal()) }
        },
        {
            icon: <SkyAvatar url={session?.profilePicture} className="w-9 h-9" />,
            label: 'Profile',
            onClick: () => pageChange(`/${session?.username ?? ""}`)
        },
    ]

    if (isHideNav) return <></>

    return (
        <div className='sticky top-0 h-full z-50'>
            <div className={cn(
                "duration-300 ease-in-out transition-all",
                "md:w-[4.5rem] xl:w-[18rem] border-r hidden md:flex h-dvh scroll-smooth overflow-x-hidden overflow-y-auto hideScrollbar",
                hideLabel ? "max-w-[4.5rem]" : "max-w-[18rem]"
            )}>
                <div className={cn(`md:w-[4.5rem] xl:w-[18rem] px-1 h-full scroll-smooth overflow-y-auto hideScrollbar`,
                    "duration-300 ease-in-out transition-all",
                    hideLabelClass ? "max-w-[4.5rem]" : "max-w-[18rem]")}>
                    <div className="w-full h-full flex flex-col space-y-1 justify-between">
                        <div className="w-full h-max flex flex-col space-y-1">
                            {/* header type */}
                            <Logo
                                label={configs.AppDetails.name}
                                onClick={SideIconData[0].onClick}
                                hideLabel={hideLabelClass} />
                            {/* main type */}
                            {SideIconData.map(({
                                icon, label, onClick,
                                countIndicatorComponent,
                                popupIndicatorComponent,
                                indicatorComponent
                            }, index) => {
                                return <NavigationItem
                                    key={index}
                                    icon={icon}
                                    label={label}
                                    popupIndicatorComponent={popupIndicatorComponent}
                                    countIndicatorComponent={countIndicatorComponent}
                                    indicatorComponent={indicatorComponent}
                                    hideLabel={hideLabelClass}
                                    onClick={onClick} />
                            })}
                        </div>
                        {/* footer type */}
                        <MoreDropdownMenu>
                            <div className="py-1">
                                <NavigationItem
                                    label="More"
                                    hideLabel={hideLabelClass}
                                    icon={<Menu size={28} />} />
                            </div>
                        </MoreDropdownMenu>
                    </div>
                </div>
                {/* sidebar */}
                <NotificationSidebar close={() => dispatch(toggleNotificationSidebar())} open={Sidebar.notificationSidebar} />
                <SearchSidebar close={() => dispatch(toggleSearchSidebar())} open={Sidebar.searchSidebar} />
            </div>
        </div>
    )
}, ((pre, next) => {
    return pre.hideLabel === next.hideLabel
        && pre.isHideNav === next.isHideNav
}))
export default NavigationSidebar;
const Logo = ({ active, label, onClick, hideLabel, className }: {
    active?: boolean
    label?: string
    onClick?: () => void
    hideLabel?: boolean
    className?: string
}) => {

    return (
        <div className={cn("w-14 h-14 mx-auto xl:w-full xl:mx-0 my-6", className)}>
            <div onClick={onClick} className={cn(`mx-auto justify-center 
            duration-300 ease-in-out transition-all delay-75
            h-14 w-14 aspect-square items-center flex rounded-xl cursor-pointer`,
                hideLabel ? "sm:flex justify-center" : "lg:w-full lg:gap-1 xl:justify-start xl:px-4")}>
                <img src={configs.AppDetails.logoUrl} alt="upload" className="w-8 h-8" />
                {hideLabel ? <></> : <p className={cn("text-primary-500 hidden xl:block font-bold text-xl")}>
                    {label}
                </p>}
            </div>
        </div>
    )
}

const NavigationItem = ({
    active, label, onClick,
    hideLabel, className,
    icon,
    countIndicatorComponent,
    popupIndicatorComponent,
    indicatorComponent
}: {
    active?: boolean
    label?: string
    onClick?: () => void
    hideLabel?: boolean
    className?: string
    icon?: React.ReactNode
    countIndicatorComponent?: React.ReactNode
    popupIndicatorComponent?: React.ReactNode
    indicatorComponent?: React.ReactNode
}) => {

    return (
        <div className={cn("w-14 h-14 mx-auto xl:w-full xl:mx-0", className)}>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <div onClick={onClick}
                            className={cn(`mx-auto justify-center h-14 w-14 aspect-square flex rounded-xl
                            duration-300 ease-in-out transition-all delay-75
                            hover:bg-accent hover:text-accent-foreground cursor-pointer`,
                                hideLabel ? "sm:flex justify-center" : "lg:w-full xl:justify-start xl:px-4")}>
                            <div className="flex items-center justify-center gap-3">
                                <div className="flex justify-end w-auto h-auto">
                                    <div className="w-8 h-8 flex items-start justify-center">
                                        {icon}
                                    </div>
                                    {indicatorComponent ?? <></>}
                                    {countIndicatorComponent ?? <></>}
                                </div>
                                {hideLabel ? <></> : <p className={cn("text-primary-500 text-base hidden xl:block",
                                    active ? "font-bold" : "font-normal")}>{label}</p>}
                            </div>
                            {popupIndicatorComponent ?? <></>}
                        </div>
                    </TooltipTrigger>
                    <TooltipContent
                        side="right"
                        className="p-0 bg-transparent border-none shadow-none">
                        {/* <p>{label}</p> */}
                        <div className={cn(`pl-3`)}>
                            <div className={cn(`w-max flex items-center
                                 bg-accent justify-center h-10 rounded-xl
                                  transition duration-500 ease-in-out`)}>
                                <div className={cn("h-4 w-4 bg-accent relative right-[0.4rem] rotate-45 rounded-sm")} />
                                <div className={cn("w-max pr-3")}>
                                    <p className="font-semibold">
                                        {label}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    )
}