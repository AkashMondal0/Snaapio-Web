import db from "@/lib/db/drizzle"
import {
  conversations,
  messages
} from "@/lib/db/schema"
import { NextRequest, NextResponse } from "next/server"
const secret = process.env.NEXTAUTH_SECRET || "secret";
import jwt from "jsonwebtoken"

export async function POST(request: NextRequest, response: NextResponse) {
  try {

    const token = request.headers.get("authorization") || request.cookies.get("token-auth")?.value
    if (!token) {
      return Response.json({
        code: 0,
        message: "Token not found",
        status_code: 404,
        data: {}
      }, { status: 404 })
    }

    let verify_id = jwt.verify(token, secret) as { email: string, id: string } as any

    verify_id = verify_id.id // logged user id

    if (!verify_id) {
      console.log("Invalid token")
      return Response.json({
        code: 0,
        message: "Invalid token",
        status_code: 404,
        data: {}
      }, { status: 404 })
    }
    // profile verification

    // const newMessage = db.$with('new_message').as(
    //   db.insert(messageTable)
    //     .values({ content: "Hello!" })
    //     .returning({ id: messageTable.id })
    // );
    
    // const result = await db.with(newMessage)
    //   .update(chatTable)
    //   .set({ lastMessage: sql`(select id from ${newMessage})` })
    //   .where(eq(chatTable.id, specificChatId)) // Replace specificChatId with the actual chat ID
    //   .returning();
    const {
      authorId,
      members,
      content,
      conversationId
    } = await request.json() as {
      authorId: string,
      members: string[],
      content: string,
      conversationId: string
    }

    const data = await db.insert(messages).values({
      content,
      authorId,
      conversationId,
    }).returning()

    /// send notification to all members

    return NextResponse.json({
      code: 1,
      message: "Create Successfully",
      status_code: 200,
      data: data
    }, { status: 200 })

  } catch (error) {
    console.log(error)
    return NextResponse.json({
      code: 0,
      message: "Internal server error",
      status_code: 500,
      data: {}
    }, { status: 500 })
  }
}