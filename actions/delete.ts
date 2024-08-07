"use server";

import blog from "@/app/(protected)/admin/blog/page";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function deleteUser(value: string) {
  let session = await auth();
  if (!session || !session.user) return { error: "Not authorized" };
  if (session.user.role !== "SUPER_ADMIN") return { error: "Not authorized" };
  let user = await db.user.findUnique({ where: { id: value } });
  if (!user) return { error: "User not found" };
  // change authour of blogs and make all blogs drafts
  if (user.role === "SUPER_ADMIN") {
    return { error: "Cannot delete super admin" };
  }
  await db.blog.updateMany({
    where: { authorId: value },
    data: { status: "draft", authorId: session.user.id },
  });
  await db.user.delete({ where: { id: value } });
  return { success: "User deleted" };
}
