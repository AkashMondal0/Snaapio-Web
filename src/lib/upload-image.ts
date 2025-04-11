import { configs } from "@/configs";
import { getBearerToken } from "./getBearerToken";

export const uploadPost = async (data: {
    files: File[]
}): Promise<any | null> => {

    if (!data?.files || !Array.isArray(data.files)) {
        console.error("Invalid data.files:", data.files);
        return;
    }

    const formData = new FormData();

    data.files.forEach((file: File) => {
        formData.append("files", file); // Change to "files" if needed
    });

    try {

        let BearerToken = await getBearerToken();

        const response = await fetch(`${configs.serverApi.baseUrl}/image/upload_variant`, {
            method: "POST",
            body: formData,
            credentials: "include",
            cache: 'no-cache',
            headers: {
                'Authorization': `${BearerToken}`,
            },
        });
        if (!response.ok) {
            const result = await response.json();
            console.error("Upload failed:", result);
            return null;
        }
        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Upload failed:", error);
        return null;
    }
};