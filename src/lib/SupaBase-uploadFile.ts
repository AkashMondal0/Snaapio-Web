// import { uuid } from "./uuid";
// import { supabase } from "./initSupabase";

// const uploadFileToSupabase = async (
//     file: File | null,
//     fileType: any,
//     id: string = "",
// ): Promise<string | null> => {
//     try {
//         if (!file) return null;
//         const { data, error } = await supabase.storage
//             .from(`skylight/${id}`)
//             .upload(uuid() + file.name.split("/").pop(), file, {
//                 contentType: fileType,
//                 cacheControl: "3600",
//                 upsert: false,
//             });

//         if (error) {
//             console.error("Error uploading file 1:", error);
//             return null;
//         }
//         return data.fullPath;
//     } catch (error) {
//         console.error("Error uploading file 2:", error);
//         return null;
//     }
// };

// export { uploadFileToSupabase };
