// import "server-only";
"use server";
import { db } from "./db";
// import { auth } from "@clerk/nextjs/server";
import {
  dataset,
  user,
  access_request,
  saved_dataset,
  session,
  account,
} from "./db/schema";
import { and, eq, or } from "drizzle-orm";
import { SignInSchema, datasetSchema } from "~/schemas/index";
import type * as z from "zod";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function getUsersByName(keyword: string) {
  // const user = auth();
  // if (!user.userId) throw new Error("Unauthorized");

  const project = await db.query.user.findFirst({
    where: (model, { eq }) => eq(model.name, keyword),
  });
  if (!project) throw new Error("Image not found");

  // if (project.userId !== user.userId) throw new Error("Unauthorized");

  return project;
}

export async function getUsers() {
  // const user = auth();

  // if (!user.userId) throw new Error("Unauthorized");

  const projects = await db.query.user.findMany({
    // where: (model, { eq }) => eq(model.userId, user.userId),
    orderBy: (model, { desc }) => desc(model.id),
  });

  return projects;
}

export async function getUser(id: string) {
  // const user = auth();
  // if (!user.userId) throw new Error("Unauthorized");

  const user = await db.query.user.findFirst({
    where: (model, { eq }) => eq(model.id, id),
  });
  if (!user) throw new Error("User not found!");

  // if (project.userId !== user.userId) throw new Error("Unauthorized");

  return user;
}

export async function changeUserRole(id: string, role: string) {
  try {
    // Validate role
    if (!["admin", "staff", "user"].includes(role)) {
      return { error: "Invalid role" };
    }

    const result = await db.update(user).set({ role }).where(eq(user.id, id));

    revalidatePath("/profile");
    revalidatePath("/admin/users");
    revalidatePath(`/admin/users/${id}`);

    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to update user role" };
  }
}

export async function deleteUser(id: string) {
  try {
    // Start a transaction to ensure all operations succeed or fail together
    return await db.transaction(async (tx) => {
      // 1. Delete sessions
      await tx.delete(session).where(eq(session.userId, id));

      // 2. Delete accounts
      await tx.delete(account).where(eq(account.userId, id));

      // 3. Delete access requests where user is either the requester or handler
      await tx
        .delete(access_request)
        .where(
          or(eq(access_request.userId, id), eq(access_request.handledBy, id)),
        );

      // 4. Delete saved datasets
      await tx.delete(saved_dataset).where(eq(saved_dataset.userId, id));

      // 5. Update datasets to remove user reference
      await tx
        .update(dataset)
        .set({ user_id: null })
        .where(eq(dataset.user_id, id));

      // 6. Finally, delete the user
      await tx.delete(user).where(eq(user.id, id));

      revalidatePath("/admin/users");
      return { success: true };
    });
  } catch (error: any) {
    console.error("Error deleting user:", error);
    return {
      error:
        error.message ||
        "Failed to delete user. Please ensure all related data is handled properly.",
    };
  }
}
