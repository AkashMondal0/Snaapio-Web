import { AuthorData, Conversation, findDataInput } from "@/types";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { CQ } from "./conversation.queries";
import { configs } from "@/configs";
import { graphqlQuery } from "@/lib/graphqlQuery";
import { uploadPost } from "@/lib/upload-image";
export const fetchConversationsApi = createAsyncThunk(
    "fetchConversationsApi/get",
    async (graphQlPageQuery: findDataInput, thunkAPI) => {
        try {
            const res = await graphqlQuery({
                query: CQ.findAllConversation,
                variables: { graphQlPageQuery },
            });
            return res;
        } catch (error: any) {
            return thunkAPI.rejectWithValue({
                ...error?.response?.data,
            });
        }
    },
);

export const fetchConversationApi = createAsyncThunk(
    "fetchConversationApi/get",
    async (id: string, thunkAPI) => {
        try {
            const res = await graphqlQuery({
                query: CQ.findOneConversation,
                variables: { graphQlPageQuery: { id } },
            });
            return res;
        } catch (error: any) {
            return thunkAPI.rejectWithValue({
                ...error?.response?.data,
            });
        }
    },
);

export const fetchConversationAllMessagesApi = createAsyncThunk(
    "fetchConversationAllMessagesApi/get",
    async (graphQlPageQuery: findDataInput, thunkAPI) => {
        try {
            const res = await graphqlQuery({
                query: CQ.findAllMessages,
                variables: { graphQlPageQuery },
            });
            return res;
        } catch (error: any) {
            return thunkAPI.rejectWithValue({
                ...error?.response?.data,
            });
        }
    },
);

export const CreateConversationApi = createAsyncThunk(
    "CreateConversationApi/post",
    async (member: AuthorData[], thunkAPI) => {
        try {
            const members_e_key = Object.fromEntries(member.map(item => [item.id, item.publicKey]));
            const res = await graphqlQuery({
                query: CQ.createConversation,
                variables: {
                    createConversationInput: {
                        isGroup: false,
                        memberIds: member.map((i) => i.id),
                        members_e_key: members_e_key
                    },
                },
            });
            return res;
        } catch (error: any) {
            return thunkAPI.rejectWithValue({
                ...error?.response?.data,
            });
        }
    },
);

//  messages
export const CreateMessageApi = createAsyncThunk(
    "CreateMessageApi/post",
    async (createMessageInput: {
        content: string;
        authorId: string;
        conversationId: string;
        members: string[];
        membersPublicKey: Conversation["membersPublicKey"]
        fileUrl: File[];
    }, thunkAPI) => {
        try {
            const fileUrls = createMessageInput?.fileUrl?.length > 0 ? await uploadPost({ files: createMessageInput.fileUrl }) : null;
            createMessageInput.fileUrl = fileUrls as any;
            const res = await graphqlQuery({
                query: CQ.createMessage,
                variables: { createMessageInput },
            });
            return res as any;
        } catch (error: any) {
            return thunkAPI.rejectWithValue({
                ...error?.response?.data,
            });
        }
    },
);

export const conversationSeenAllMessage = createAsyncThunk(
    "conversationSeenAllMessage/post",
    async ({
        conversationId,
        authorId,
    }: {
        conversationId: string;
        authorId: string;
    }, thunkAPI) => {
        try {
            await graphqlQuery({
                query: CQ.seenMessages,
                variables: { conversationId },
            });
            return { conversationId, authorId };
        } catch (error: any) {
            return thunkAPI.rejectWithValue({
                ...error?.response?.data,
            });
        }
    },
);

// ai messages

export const AiMessagePromptApi = createAsyncThunk(
    "AiMessagePromptApi/post",
    async (data: {
        content: string;
        authorId: string;
        file?: string | null;
    }, thunkAPI) => {
        if (!configs.serverApi.aiApiUrl) {
            return thunkAPI.rejectWithValue({
                message: "AI API URL not found",
            });
        }
        try {
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            let raw;
            if (data.file) {
                //TODO: upload file to supabase
                // let fileUrl = await uploadFileToSupabase(
                //     data?.file,
                //     "image/jpeg",
                //     data.authorId,
                // );
                // raw = JSON.stringify({
                //     "image": configs.serverApi.supabaseStorageUrl + fileUrl,
                //     "query": data.content,
                // });
            } else {
                raw = JSON.stringify({
                    "query": data.content,
                });
            }
            const res = await fetch(configs.serverApi.aiApiUrl, {
                method: "POST",
                headers: myHeaders,
                body: raw,
                redirect: "follow",
            });
            const resJson = await res.text();
            return resJson;
        } catch (error: any) {
            console.error(error);
            return thunkAPI.rejectWithValue({
                ...error?.response?.data,
            });
        }
    },
);
