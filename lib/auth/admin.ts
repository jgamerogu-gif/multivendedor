
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function isAdmin() {
  const { userId } = await auth();

  if (!userId) {
    return false;
  }

  const user = await db.user.findUnique({
    where: {
      clerkId: userId,
    },
    select: {
      role: true,
    },
  });

  return user?.role === "ADMIN";
}