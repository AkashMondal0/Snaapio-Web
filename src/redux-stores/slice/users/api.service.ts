import { createAsyncThunk } from "@reduxjs/toolkit";
import { QUsers } from "./users.queries";
import { graphqlQuery } from "@/lib/graphqlQuery";


export const searchUsersProfileApi = createAsyncThunk(
    'searchUsersProfileApi/get',
    async (keyword: string, thunkApi) => {
        try {
            const res = await graphqlQuery({
                query: QUsers.findUsersByKeyword,
                variables: { graphQLPageQuery: { id: keyword } }
            })
            return res
        } catch (error: any) {
            return thunkApi.rejectWithValue({
                ...error?.response?.data,
            })
        }
    }
);