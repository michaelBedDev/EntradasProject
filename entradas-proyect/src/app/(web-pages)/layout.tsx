// app/(with-nav)/layout.tsx  — SERVER COMPONENT
import AuthRequiredModal from "@/components/AuthRequiredModal";
import ModernNavbar from "@/components/app/ModernNavbar";

export default async function WithNavLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ModernNavbar />
      {children}
      <AuthRequiredModal />
    </>
  );
}
