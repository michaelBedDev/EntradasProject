// app/(with-nav)/layout.tsx  — SERVER COMPONENT
import AuthRequiredModal from "@/components/AuthRequiredModal";
import ModernNavbarWrapper from "@/features/layout/components/navbar/NavbarWrapper";

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
