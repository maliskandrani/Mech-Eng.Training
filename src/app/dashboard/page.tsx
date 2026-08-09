import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

const ROLE_PREFIX: Record<string, string> = {
  ADMIN: "/dashboard/admin",
  TRAINER: "/dashboard/trainer",
  STUDENT: "/dashboard/student",
};

export default async function DashboardIndexPage() {
  const session = await auth();
  redirect(ROLE_PREFIX[session?.user?.role ?? ""] ?? "/");
}
