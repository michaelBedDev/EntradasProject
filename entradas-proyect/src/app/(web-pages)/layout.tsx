// app/(with-nav)/layout.tsx  — SERVER COMPONENT
import AuthRequiredModal from "@/components/AuthRequiredModal";
import ModernNavbarWrapper from "@/components/app/ModernNavbar/ModernNavbarWrapper";

export default async function WithNavLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ModernNavbarWrapper />
      {children}
      <AuthRequiredModal />
    </>
  );
}
