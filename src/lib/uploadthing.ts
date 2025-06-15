import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
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
      // Optional: Check auth here
      return {};
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata);
      console.log("file url", file.ufsUrl);
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

import {
  generateUploadButton,
  generateUploadDropzone,
} from "@uploadthing/react";

export const UploadButton = generateUploadButton<OurFileRouter>();
export const UploadDropzone = generateUploadDropzone<OurFileRouter>();
