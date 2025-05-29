import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  imageUploader: f({
    image: {
      /**
       * For full list of options and defaults, see the File Route API reference
       * @see https://docs.uploadthing.com/file-routes#route-config
       */
      maxFileSize: "8MB",
      maxFileCount: 1,
    },
  })
    .middleware(async ({ req }) => {
      try {
        // This code runs on your server before upload
        const user = { id: "fakeId" }; // Replace with your actual auth

        if (!user) throw new UploadThingError("Unauthorized");

        return { userId: user.id };
      } catch (error) {
        console.error("Upload middleware error:", error);
        throw new UploadThingError("Failed to process upload");
      }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      try {
        console.log("Upload complete for userId:", metadata.userId);
        console.log("file url", file.url);
        return { uploadedBy: metadata.userId };
      } catch (error) {
        console.error("Upload complete error:", error);
        throw new UploadThingError("Failed to complete upload");
      }
    }),
  datasetUploader: f({
    pdf: { maxFileSize: "32MB" },
    "application/msword": { maxFileSize: "32MB" },
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
      maxFileSize: "32MB",
    },
    "text/plain": { maxFileSize: "32MB" },
    "text/csv": { maxFileSize: "32MB" },
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": {
      maxFileSize: "32MB",
    },
    "application/vnd.ms-excel": { maxFileSize: "32MB" },
  })
    .middleware(async () => {
      try {
        return {};
      } catch (error) {
        console.error("Upload middleware error:", error);
        throw new UploadThingError("Failed to process upload");
      }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      try {
        console.log("Upload complete:", file.url);
        return { url: file.url };
      } catch (error) {
        console.error("Upload complete error:", error);
        throw new UploadThingError("Failed to complete upload");
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
