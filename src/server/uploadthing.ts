import { UTApi } from "uploadthing/server";

export const utapi = new UTApi({
  token: process.env.UPLOADTHING_TOKEN,
});

// export async function getUploadthingUrl(fileKey: string) {
//   try {
//     const response = await utapi.getFileUrls([fileKey]);
//     if (!response?.data?.[0]?.url) {
//       return null;
//     }
//     return response.data[0].url;
//   } catch (error) {
//     console.error("Error getting file URL:", error);
//     return null;
//   }
// }
