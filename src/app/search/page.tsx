'use client';
import React, { memo, useCallback } from 'react'
import { X } from 'lucide-react'
import { debounce } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { AuthorData } from '@/types';
import { useRouter } from 'next/navigation';
import SkyAvatar from '@/components/sky/SkyAvatar';
import { NavigationBottom } from '@/components/Navigation';
import { LoadingUserCardWithButton } from '@/components/loading/Card';
import { RootState } from '@/redux-stores/store';
import { searchUsersProfileApi } from '@/redux-stores/slice/users/api.service';
import { removeAllUserFormSearch } from '@/redux-stores/slice/users';

const SearchModel = () => {
  const dispatch = useDispatch();
  const inputRef = React.useRef<any>("");
  const Users = useSelector((Root: RootState) => Root.UsersState);

  const handleSearch = useCallback(() => {
    if (inputRef?.current?.value) {
      dispatch(searchUsersProfileApi(inputRef?.current?.value) as any)
    }
  }, []);

  const debouncedHandleSearch = useCallback(debounce(handleSearch, 1000), []);

  const clearAll = useCallback(() => {
    dispatch(removeAllUserFormSearch() as any)
  }, []);

  return (
    <>
      <div className='w-full p-4 min-h-screen'>
        <div className='w-full space-y-4'>
          <div className={`w-full p-2 px-4 border bg-secondary text-secondary-foreground rounded-xl focus:outline-none focus:ring-0`}>
            <input type="text" placeholder='Search'
              ref={inputRef}
              onChange={debouncedHandleSearch}
              className='w-full bg-transparent focus:outline-none focus:ring-0' />
          </div>
        </div>
        {Users.searchUsers.length > 0 ? <div className='flex justify-between m-2'>
          <div className='font-semibold'>Recent</div>
          <div className='text-primary text-blue-00 cursor-pointer' onClick={clearAll}>Clear All</div>
        </div> : <></>}
        {Users.searchUsersLoading ?
          <div className='space-y-4'>
            {Array(10).fill(0).map((_, i) => <LoadingUserCardWithButton key={i} />)}
          </div> :
          Users.searchUsers?.map((item, i) => <UserItem key={i} item={item} />)}
      </div>
      <NavigationBottom />
    </>
  )
}


const UserItem = memo(function UserItem({
  item
}: {
  item: AuthorData
}) {

  const dispatch = useDispatch();
  const router = useRouter()

  const removeUser = useCallback(() => {
    // dispatch(removeAllUserFormSearch() as any)
  }, []);

  const navigateToProfile = useCallback(() => {
    router.push(`/${item.username}`)
  }, []);

  return (
    <>
      <div className='flex justify-between p-2  cursor-pointer
      hover:bg-secondary hover:text-secondary-foreground rounded-2xl my-1'>
        <div className='flex space-x-2 items-center' onClick={navigateToProfile}>
          <SkyAvatar url={item.profilePicture} className='h-12 w-12 mx-auto' />
          <div className='ml-2'>
            <div className='font-semibold text-base text-start'>{item.username}</div>
            <div className='text-sm'>
              {item.email}
            </div>
          </div>
        </div>
        <div className='flex items-center cursor-pointer' onClick={removeUser}>
          <X />
        </div>
      </div>
    </>
  )
}, (() => true))

export default SearchModel