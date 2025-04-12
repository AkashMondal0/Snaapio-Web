import { NavigationBottom } from '@/components/Navigation';
import { NavigationSidebar } from '@/components/Navigation';
import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Edit Profile • Sky Media',
  description: `Sky Media is a social media platform that 
  allows users to share their thoughts and ideas with the world.`,
}

export default async function RootLayout({ children }: {
  children: React.ReactNode;
}) {

  return (
    <>
      <div className='flex'>
        <NavigationSidebar />
        {children}
      </div>
      <NavigationBottom />
    </>
  )
}
