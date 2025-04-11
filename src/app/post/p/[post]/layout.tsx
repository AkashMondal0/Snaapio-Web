import { configs } from "@/configs";
import { Assets, AuthorData } from "@/types";
import { NotFoundMetadata, metaRobots } from "@/types/Metadata";
import { Metadata } from "next";

interface PostData {
  id: string,
  content: string,
  fileUrl: Assets[],
  likeCount: number,
  commentCount: number,
  user: AuthorData
  createdAt: Date
}

export async function generateMetadata({ params: { post } }: { params: { post: string } }): Promise<Metadata> {
  try {
    const res = await fetch(`${configs.serverApi.baseUrl}/post/${post}`)

    if (!res.ok) return NotFoundMetadata
    const data = await res.json() as PostData

    if (!data) return NotFoundMetadata
    if (!data?.user?.name) return NotFoundMetadata

    const title = `${data.user.name} on Snaapio: ${data.content}`;
    const description = `Posted on: ${new Date(data.createdAt).toDateString()}, Likes: ${data.likeCount}, Comments: ${data.commentCount}, Image: ${data.fileUrl[0]}`;
    const image = configs.serverApi.supabaseStorageUrl ? configs.serverApi.supabaseStorageUrl + data.fileUrl[0]?.square_sm : configs.AppDetails.primaryLightLogo

    return {
      title: title,
      description: description,
      // 
      generator: 'Snaapio',
      applicationName: `${configs.AppDetails.name} `,
      referrer: 'origin-when-cross-origin',
      keywords: [data.user.username, data.user.name, 'Snaapio'],
      authors: [{ name: data?.user.name, url: `https://skysolo.me/${data.user.username}` }],
      creator: data.user.name,
      publisher: data.user.username,
      // metadataBase: new URL(`${configs.AppDetails.appUrl}/p/${data.id}`),
      //
      openGraph: {
        title: title,
        description: description,
        url: `${configs.AppDetails.appUrl}/p/${data.id}`,
        siteName: 'Snaapio',
        locale: "en-US",
        type: 'website',
        images: [
          {
            type: "image/png",
            width: 800,
            height: 600,
            url: image
          },
          {
            type: "image/png",
            width: 200,
            height: 200,
            url: image
          }
        ]
      },
      twitter: {
        card: 'summary_large_image',
        title: title,
        description: description,
        site: '@SnaapioApp',
        creator: `@${data.user.username}`,
        images: [image],
      },
      category: `${configs.AppDetails.category}`,
      robots: metaRobots
    }
  } catch (error) {
    console.error('Error generating metadata', error)
    return NotFoundMetadata
  }
}


export default function RootLayout({ children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
    </>
  )
}
