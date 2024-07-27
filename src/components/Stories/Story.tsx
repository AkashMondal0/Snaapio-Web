"use client"
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { StoryItem, YourStory } from '@/components/Stories/StoryItem';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useVirtualizer } from '@tanstack/react-virtual';
import { generateRandomUsername } from '../sky/random';
const story = Array.from({ length: 20 }, (_, i) => {
    return {
        url: `https://picsum.photos/id/${100 + i}/${50}/${50}`,
        label: `${generateRandomUsername()}`
    }
})
interface StoriesProp {
    // story: {
    //     url: string
    //     label: string
    // }[]
}
let _kSavedOffset = 0;
let _KMeasurementsCache = [] as any // as VirtualItem[] ;
export const Stories = memo(function Story({
    // story
}: StoriesProp) {

    // const posts = useSelector((Root: RootState) => Root.posts)
    const parentRef = useRef<HTMLDivElement>(null)
    const [mounted, setMounted] = useState(false)
    const data = useMemo(() => story, [story])
    const count = useMemo(() => data.length, [data.length])

    const columnVirtualizer = useVirtualizer({
        horizontal: true,
        count: count,
        getScrollElement: () => parentRef.current,
        estimateSize: useCallback(() => 80,[]),
        overscan: 5,
    })

    useEffect(() => {
        setMounted(true)
    }, [])

    // const items = columnVirtualizer.getVirtualItems()
    if (!mounted) return <></>

    return (
        <>
            <div
                ref={parentRef}
                className="w-full md:max-w-[580px] mx-auto px-3 flex border-b md:border-none hideScrollbar mt-4"
                style={{
                    width: `100%`,
                    height: `100px`,
                    overflow: 'auto',
                }}
            >
              <YourStory/>
                <div
                    style={{
                        width: `${columnVirtualizer.getTotalSize()}px`,
                        height: '100%',
                        position: 'relative',
                    }}
                >
                    {columnVirtualizer.getVirtualItems().map((virtualColumn) => (
                        <div
                            key={virtualColumn.index}
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                height: '100%',
                                width: `${virtualColumn.size}px`,
                                transform: `translateX(${virtualColumn.start}px)`,
                            }}
                        >
                            <StoryItem key={virtualColumn.index}
                                story={data[virtualColumn.index]}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
})