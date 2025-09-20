"use client";

import { usePathname } from "next/navigation";
import { BreadcrumbPage } from "../ui/breadcrumb";

export default function BreadcrumbPageClient() {
  const pathName = usePathname();

  return (
    <BreadcrumbPage>
      {pathName === "/" && "Home"}
      {pathName === "/create" && "Create"}
      {pathName === "/account/settings" && "Settings"}
      {pathName === "/account/security" && "Security"}
    </BreadcrumbPage>
  );
}
