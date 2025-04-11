// import { Assets } from "@/types";
// import { compressImage } from "./image.compress";
// import { uploadFileToSupabase } from "./SupaBase-uploadFile";
// import { uuid } from "./uuid";

// const FileCompressAndUpload = async (files: File[]): Promise<Assets[] | []> => {
//     try {
//         let fileUrls: Assets[] = [];
//         if (files.length > 0) {
//             await Promise.all(files.map(async (file) => {
//                 const compressedFile = await compressImage(file, {});
//                 if (!compressedFile) return;
//                 const fileUrl = await uploadFileToSupabase(compressedFile.file, compressedFile.file.type);
//                 if (!fileUrl) return;
//                 fileUrls.push({
//                     id: uuid(),
//                     type: "photo",
//                     urls: {
//                         high: fileUrl,
//                         low: fileUrl,
//                         medium: fileUrl,
//                     }
//                 });
//             }));
//         }
//         return fileUrls;
//     } catch (error) {
//         console.error("Error uploading files", error);
//         return [];
//     }
// }

// export default FileCompressAndUpload;