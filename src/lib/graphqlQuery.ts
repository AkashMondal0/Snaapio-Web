
import { configs } from "@/configs"
import { getBearerToken } from "./getBearerToken";
interface GraphqlResponse<T> {
    data: T;
    errors: GraphqlError[];
    error: GraphqlError;
}
export type GraphqlQueryType = {
    name: string
    operation: string
    query: string
}
export interface GraphqlError {
    message: string;
    locations?: { line: number; column: number }[];
    path?: string[];
    extensions?: any;
}

export const graphqlQuery = async <T>({
    query,
    variables,
    url = `${configs.serverApi.baseUrl}/graphql`.replace("/v1", ""),
}: {
    query: string;
    variables?: any;
    url?: string;
    withCredentials?: boolean;
    errorCallBack?: (error: GraphqlError[]) => void;
}): Promise<T | any> => {
    try {
        const BearerToken = await getBearerToken();
        if (!BearerToken) {
            console.error("Error retrieving token from SecureStorage");
            return;
        };

        const response = await fetch(url, {
            method: 'POST',
            credentials: "include",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${BearerToken}`,
            },
            body: JSON.stringify({
                query,
                variables,
            }),
            cache: 'no-cache',
        });

        if (!response.ok) {
            const responseBody: GraphqlResponse<any> = await response.json();
            console.error(responseBody)
            throw new Error('Network response was not ok');
        }

        const responseBody: GraphqlResponse<any> = await response.json();

        if (responseBody?.errors || !responseBody?.data || responseBody?.error) {
            console.error(responseBody)
            throw new Error('Error in response');
        }

        return responseBody.data[Object.keys(responseBody.data)[0]];
    } catch (e) {
        console.error("Internal Error", e)
        throw new Error('Internal Error');
    }
}