// import Compressor from "compressorjs";
// type Options = {
//   width?: number,
//   height?: number,
//   quality?: number,
//   resize?: "cover" | "contain" | "none",
//   mimeType?: ""
// }
// type compress = {
//   file:File,
//   blob:Blob,
//   localSrc:string
// }
// export const compress = async (
//   file: File,
//   quality: number,
//   maxHeight: number,
//   maxWidth: number,
//   convertSize?: number
// ): Promise<File | Blob> => {
//   return await new Promise((resolve, reject) => {
//     new Compressor(file, {
//       quality,
//       maxHeight,
//       maxWidth,
//       convertSize,
//       success: resolve,
//       error: reject,
//     });
//   });
// };

// export const compressImage = async (image: File, options: Options): Promise<compress | null> => {
//   if (!image) {
//     return null
//   }
  
//   let file = new Promise((resolve, reject) => {
//     // Simulate an asynchronous operation using setTimeout
//     new Compressor(image, {
//       quality: options.quality ?? 0.8, // the compression ratio
//       width: options.width ?? 1080, // Adjust the maximum width of the compressed image
//       height: options.height ?? 1080,
//       mimeType: "image/jpeg",
//       resize: options.resize ?? "none",
//       success(result) {
//         const reader = new FileReader();
//         reader.readAsDataURL(result);
//         reader.onloadend = function () {
//           var file = new File([result], `${image.name}.jpeg`, {type: "image/jpeg", lastModified: Date.now()});
//           resolve({
//             file,
//             blob: reader.result,
//             localSrc: URL.createObjectURL(file)
//           })
//         }
//       },
//       error(err) {
//         reject(null)
//       },
//     })
//   });

//   return file.then((data) => {
//     return data as compress;
//   }).catch((error) => {
//     return null;
//   })
// };

// async function getImageDimensions(file: File): Promise<string> {
//   return new Promise((resolve, reject) => {
//     const reader = new FileReader();

//     reader.onload = (event) => {
//       const img = new Image();

//       img.onload = () => {
//         const width = img.width.toString().padStart(2, '0');
//         const height = img.height.toString().padStart(2, '0');
//         resolve(`${width}x${height}`);
//       };

//       img.onerror = () => reject('Failed to load image');

//       // @ts-ignore
//       img.src = event.target.result as string;
//     };

//     reader.onerror = () => reject('Failed to read file');

//     reader.readAsDataURL(file);
//   });
// }