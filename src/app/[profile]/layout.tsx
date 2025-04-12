import UnauthorizedAlert from "@/components/Alert/UnauthorizedAlert"
import { NavigationSidebar } from "@/components/Navigation"
import { configs } from "@/configs"
import { NotFoundMetadata, metaRobots } from "@/types/Metadata"
import { Metadata } from "next"
import { cookies } from "next/headers"
interface AuthorData {
  username: string
  name: string
  profilePicture?: string
  postCount?: number;
  followerCount?: number;
  followingCount?: number;
  bio: string
  website: string[]
}
export async function generateMetadata({ params: { profile } }: any): Promise<Metadata> {
  try {
    const res = await fetch(`${configs.serverApi.baseUrl}/users/${profile}`, { cache: "no-cache" })

    if (!res.ok) return NotFoundMetadata

    const data = await res.json() as AuthorData

    if (!data) return NotFoundMetadata

    const title = `${data?.name} (@${data.username}) • Snaapio photos and videos`
    const description = `${data?.followerCount} Followers, ${data?.followingCount} Following, ${data?.postCount} posts - See Snaapio photos and video form(@${data.username})`
    const image = configs.serverApi.supabaseStorageUrl ? configs.serverApi.supabaseStorageUrl + data?.profilePicture : configs.AppDetails.primaryLightLogo

    return {
      title: title,
      description: description,
      generator: 'Snaapio',
      applicationName: `${configs.AppDetails.name} `,
      referrer: 'origin-when-cross-origin',
      keywords: [data.username, data.name, 'Snaapio'],
      authors: [
        { name: data?.name, url: `${configs.appUrl}${data.username}` },
        // profile user other social account links
        // { name: 'Akash Mondal', url: 'https://github.com/akashmondal0' },
        // { name: 'Akash Mondal', url: "https://www.instagram.com/iamskysolo/" },
        // { name: 'Akash Mondal', url: 'https://www.linkedin.com/in/akashmondal0' }
      ],
      creator: data.name,
      publisher: data.username,
      // metadataBase: new URL(`${configs.AppDetails.appUrl}/${data.username}`),
      category: `Public figure`,
      // openGraph
      openGraph: {
        title: title,
        description: description,
        url: `${configs.AppDetails.appUrl}/${data.username}`,
        siteName: 'Snaapio',
        locale: "en-IN",
        type: 'website',
        images: [
          {
            type: "image/png",
            width: 200,
            height: 200,
            alt: "image not found",
            url: image
          },
          {
            type: "image/png",
            width: 800,
            height: 600,
            alt: "image not found",
            url: image
          },
        ]
      },
      // twitter
      twitter: {
        card: 'summary_large_image',
        title: title,
        description: description,
        site: '@SnaapioApp',
        creator: `@${data.username}`,
        images: [image],
      },
      // robots
      robots: metaRobots
    }
  } catch (error) {
    return NotFoundMetadata
  }
}

export default async function RootLayout({ children, modal }: {
  children: React.ReactNode
  modal: React.ReactNode
}) {
  const cookieStore = cookies();
  const Cookies = cookieStore.get("skylight-token");

  return (
    <>
      <div className="flex">
        {Cookies ? <NavigationSidebar /> : <></>}
        {children}
        {modal}
      </div>
      {!Cookies ? <UnauthorizedAlert /> : <></>}
    </>
  )
}
