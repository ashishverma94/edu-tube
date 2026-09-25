import { getAuthUser } from "@/utils/auth";
import { redirect } from "next/navigation";
import Navbar from "@/components/common/Navbar";

export default async function LibraryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authUser = await getAuthUser();

  if (!authUser) {
    redirect("/auth");
  }

  return (
    <div className="min-h-screen w-full bg-background text-foreground">
      <Navbar />

      {children}
    </div>
  );
}
