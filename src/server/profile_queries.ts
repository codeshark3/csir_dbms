// import "server-only";
"use server";
import { db } from "./db";
import * as z from "zod";
import { and, eq, ilike, or } from "drizzle-orm";
// import {
//   datasetInsertSchema,
//   datasetSchema,
//   papersSchema,
// } from "~/schemas/index";
import {
  dataset,
  tags,
  datasetTags,
  saved_dataset,
  access_request,
  user,
  //  papers,
} from "./db/schema";
import { auth } from "~/lib/auth";
import { headers } from "next/headers";
import { title } from "process";
import { revalidatePath } from "next/cache";

export async function getProfile() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user_id = session?.user.id;
  if (!user_id) {
    return { error: "Not authenticated!" };
  }

  const profile = await db.query.user.findFirst({
    where: eq(user.id, user_id),
  });

  return profile;
}
