import { AuthorData, findDataInput } from "@/types";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { QPost } from "./post.queries";
import { graphqlQuery } from "@/lib/graphqlQuery";

export const fetchOnePostApi = createAsyncThunk(
    'fetchOnePostApi/get',
    async (graphQlPageQuery: findDataInput, thunkApi) => {
        try {
            const data = await graphqlQuery({
                query: QPost.findOnePost,
                variables: { graphQlPageQuery }
            })
            return data
        } catch (error: any) {
            return thunkApi.rejectWithValue({
                message: error?.message
            })
        }
    }
);

export const createPostCommentApi = createAsyncThunk(
    'createPostCommentApi/post',
    async (data: {
        postId: string,
        user: AuthorData,
        content: string,
        authorId: string
    }, thunkApi) => {
        const { user, ...createCommentInput } = data
        try {
            const res = await graphqlQuery({
                query: QPost.createComment,
                variables: { createCommentInput }
            })
            return { ...res, user }
        } catch (error: any) {
            return thunkApi.rejectWithValue({
                ...error?.response?.data,
            })
        }
    }
);

export const fetchPostLikesApi = createAsyncThunk(
    'fetchPostLikesApi/get',
    async (findAllLikesInput: {
        offset: number,
        limit: number,
        id: string
    }, thunkApi) => {
        try {
            const res = await graphqlQuery({
                query: QPost.findAllLikes,
                variables: { findAllLikesInput }
            })
            return res
        } catch (error: any) {
            return thunkApi.rejectWithValue({
                ...error?.response?.data,
            })
        }
    }
);

export const fetchPostCommentsApi = createAsyncThunk(
    'fetchPostCommentsApi/get',
    async (createCommentInput: {
        offset: number,
        limit: number,
        id: string
    }, thunkApi) => {
        try {
            const res = await graphqlQuery({
                query: QPost.findAllComments,
                variables: { createCommentInput }
            })
            return res
        } catch (error: any) {
            return thunkApi.rejectWithValue({
                ...error?.response?.data,
            })
        }
    }
);