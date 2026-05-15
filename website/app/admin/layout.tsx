import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminNav from "@/components/admin-nav";

export const metadata = {
  title: "Admin — Tijdgeest",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: member } = await supabase
    .from("members")
    .select("role, status")
    .eq("user_id", user.id)
    .single();

  if (!member || member.role !== "admin" || member.status !== "approved") {
    redirect("/");
  }

  return (
    <>
      <AdminNav email={user.email ?? ""} />
      {children}
    </>
  );
}
