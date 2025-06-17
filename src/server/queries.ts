// import "server-only";
"use server";
import { db } from "./db";
// import { auth } from "@clerk/nextjs/server";
import { dataset, user } from "./db/schema";
import { and, eq } from "drizzle-orm";
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
