// import "server-only";
"use server";
import { db } from "./db";
import * as z from "zod";
import { and, count, eq, ilike, or } from "drizzle-orm";
import {
  datasetInsertSchema,
  datasetSchema,
  papersSchema,
} from "~/schemas/index";
import {
  dataset,
  tags,
  datasetTags,
  saved_dataset,
  access_request,
  //  papers,
  user,
  dataset_files,
} from "./db/schema";

import { auth } from "~/lib/auth";
import { headers } from "next/headers";
import { title } from "process";
import { revalidatePath } from "next/cache";
export async function insertDataset({
  values,
  fileUrl,
  datasetId,
  fileType,
  fileName,
}: {
  values: z.infer<typeof datasetSchema>;
  fileUrl: string;
  datasetId: string;
  fileType: string;
  fileName: string;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user_id = session?.user.id;
  const validatedFields = datasetSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid Fields!" };
  }
  const {
    title,
    year,
    pi_name,
    description,
    division,
    papers,
    tags,
    fileUrls,
  } = validatedFields.data;

  try {
    // Insert the main dataset record
    await db.insert(dataset).values({
      id: datasetId,
      title,
      year,
      pi_name,
      description,
      division,
      papers: JSON.stringify(papers),
      tags,
      user_id: user_id,
    });

    // Insert all file URLs into the dataset_files table
    const allFileUrls = [fileUrl, ...(fileUrls || [])];
    await db.insert(dataset_files).values(
      allFileUrls.map((url) => ({
        datasetId,
        fileUrl: url,
        fileType: url.split(".").pop() || "",
        fileName: url.split("/").pop() || "",
      })),
    );

    revalidatePath("/datasets");
    return { success: true, message: "Dataset added successfully!" };
  } catch (error: any) {
    return { error: error?.message };
  }
}

// export async function insertPapers(
//   values: z.infer<typeof papersSchema>,
//   datasetId: string,
// ) {
//   const validatedFields = papersSchema.safeParse(values);
//   if (!validatedFields.success) {
//     return { error: "Invalid Fields!" };
//   }
//   const { title, url } = validatedFields.data;
//   const session = await auth.api.getSession({
//     headers: await headers(),
//   });
//   const user_id = session?.user.id;
//   await db.insert(papers).values({ title, url, datasetId, userId: user_id });
// }

export async function getDatasets() {
  const datasets = await db
    .select({
      id: dataset.id,
      title: dataset.title,
      year: dataset.year,
      pi_name: dataset.pi_name,
      division: dataset.division,
      description: dataset.description,
      papers: dataset.papers,
      tags: dataset.tags,

      createdAt: dataset.createdAt,
      updatedAt: dataset.updatedAt,
      user_id: dataset.user_id,
    })
    .from(dataset);

  // Get additional file URLs for each dataset
  const datasetsWithFiles = await Promise.all(
    datasets.map(async (dataset) => {
      const additionalFiles = await db
        .select({
          fileUrl: dataset_files.fileUrl,
        })
        .from(dataset_files)
        .where(eq(dataset_files.datasetId, dataset.id));

      return {
        ...dataset,
        additionalFileUrls: additionalFiles.map((file) => file.fileUrl),
      };
    }),
  );

  return datasetsWithFiles;
}

export async function getDatasetsForSearch(query: string) {
  const datasets = await db
    .select({
      id: dataset.id,
      title: dataset.title,
      year: dataset.year,
      pi_name: dataset.pi_name,
      division: dataset.division,
      description: dataset.description,
    })
    .from(dataset)
    .where(
      or(
        ilike(dataset.title, `%${query}%`),
        ilike(dataset.description, `%${query}%`),
        ilike(dataset.pi_name, `%${query}%`),
        ilike(dataset.division, `%${query}%`),
        ilike(dataset.year, `%${query}%`),
      ),
    );

  // Get additional file URLs for each dataset
  const datasetsWithFiles = await Promise.all(
    datasets.map(async (dataset) => {
      const additionalFiles = await db
        .select({
          fileUrl: dataset_files.fileUrl,
        })
        .from(dataset_files)
        .where(eq(dataset_files.datasetId, dataset.id));

      return {
        ...dataset,
        additionalFileUrls: additionalFiles.map((file) => file.fileUrl),
      };
    }),
  );

  return datasetsWithFiles;
}

export async function getDatasetById(id: string) {
  const returnedDataset = await db
    .select()
    .from(dataset)
    .where(eq(dataset.id, id));

  if (returnedDataset.length === 0) {
    return null;
  }

  // Get all file URLs from dataset_files table
  const files = await db
    .select({
      fileUrl: dataset_files.fileUrl,
      fileType: dataset_files.fileType,
      fileName: dataset_files.fileName,
    })
    .from(dataset_files)
    .where(eq(dataset_files.datasetId, id));

  return {
    ...returnedDataset[0],
    files,
  };
}

export async function deleteDataset(id: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user?.id) throw new Error("Unauthorized");
  const user_id = session.user.id;

  try {
    await db.delete(dataset).where(eq(dataset.id, id));
    revalidatePath("/datasets");
    return { success: true, message: "Dataset deleted successfully!" };
  } catch (error: any) {
    return { error: error?.message };
  }
}
export async function updateDataset(
  id: string,
  data: z.infer<typeof datasetSchema>,
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user?.id) throw new Error("Unauthorized");
  const user_id = session.user.id;

  // Convert papers array to string
  const formattedData = {
    ...data,
    papers: JSON.stringify(data.papers),
  };

  try {
    await db.update(dataset).set(formattedData).where(eq(dataset.id, id));
    revalidatePath("/datasets");
    return { success: true, message: "Dataset updated successfully!" };
  } catch (error: any) {
    return { error: error?.message };
  }
}

export async function saveDataset(datasetId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user?.id) throw new Error("Unauthorized");
  const user_id = session.user.id;

  try {
    await db.insert(saved_dataset).values({ datasetId, userId: user_id });
  } catch (error: any) {
    return { error: error?.message };
  }
}

export async function checkSavedDataset(datasetId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user?.id) throw new Error("Unauthorized");
  const user_id = session.user.id;
  const savedDataset = await db
    .select()
    .from(saved_dataset)
    .where(
      and(
        eq(saved_dataset.datasetId, datasetId),
        eq(saved_dataset.userId, user_id),
      ),
    );

  if (savedDataset.length > 0) {
    return true;
  } else {
    return false;
  }
}
export async function getSavedDatasets() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user?.id) throw new Error("Unauthorized");
  const user_id = session.user.id;

  const savedDatasets = await db
    .select({
      id: saved_dataset.id,
      userId: saved_dataset.userId,
      datasetId: saved_dataset.datasetId,
      title: dataset.title,
      status: access_request.status,
    })
    .from(saved_dataset)
    .leftJoin(dataset, eq(saved_dataset.datasetId, dataset.id))
    .leftJoin(
      access_request,
      and(
        eq(access_request.datasetId, saved_dataset.datasetId),
        eq(access_request.userId, saved_dataset.userId),
      ),
    )
    .where(eq(saved_dataset.userId, user_id));
  return savedDatasets;
}
{
}

export async function deleteSavedDataset(datasetId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user?.id) throw new Error("Unauthorized");
  const user_id = session.user.id;

  try {
    await db
      .delete(saved_dataset)
      .where(
        and(
          eq(saved_dataset.datasetId, datasetId),
          eq(saved_dataset.userId, user_id),
        ),
      );
  } catch (error: any) {
    return { error: error?.message };
  }
}

export async function getDatasetStatistics() {
  const counts = await db
    .select({
      count: count(),
    })
    .from(dataset);

  const requests = await db
    .select({
      count: count(),
    })
    .from(access_request);

  const users = await db
    .select({
      count: count(),
    })
    .from(user);

  // INSERT_YOUR_CODE
  const statistics = [counts[0]?.count, requests[0]?.count, users[0]?.count];
  return statistics;
}
