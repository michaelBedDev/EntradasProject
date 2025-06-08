// app/(with-nav)/layout.tsx  — SERVER COMPONENT
import AuthRequiredModal from "@/components/AuthRequiredModal";
import NavbarWrapper from "@/features/layout/components/navbar/NavbarWrapper";

export default async function WithNavLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NavbarWrapper />
      {children}
      <AuthRequiredModal />
    </>
  );
}
