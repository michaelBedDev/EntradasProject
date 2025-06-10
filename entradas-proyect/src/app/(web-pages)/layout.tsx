// app/(with-nav)/layout.tsx  — SERVER COMPONENT
import NavbarWrapper from "@/features/layout/components/navbar/NavbarWrapper";

export default function WithNavLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <NavbarWrapper />
      <main className="flex-1">{children}</main>
    </div>
  );
}
