"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";

export default function ClientLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Define routes that should NOT have the global header and footer
  const isAuthPage = pathname === "/login" || pathname === "/register";
  const isAdminPage = pathname?.startsWith("/admin");
  
  const showHeaderFooter = !isAuthPage && !isAdminPage;

  if (!showHeaderFooter) {
    return (
      <main className="flex-1 min-h-screen">
        {children}
      </main>
    );
  }

  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
