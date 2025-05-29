import { UTApi } from "uploadthing/server";

const utapi = new UTApi({
  token: process.env.UPLOADTHING_TOKEN,
});

export async function getUploadthingUrl(fileKey: string) {
  try {
    const response = await utapi.getFileUrl(fileKey);
    if (!response?.url) {
      return null;
    }
    return response.url;
  } catch (error) {
    console.error("Error getting file URL:", error);
    return null;
  }
}
