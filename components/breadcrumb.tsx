"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const breadcrumbMap: { [key: string]: string } = {
  "/manage/dashboard/users": "Users",
  "/manage/dashboard/supported-nfts": "Supported NFTs",
};

export default function Breadcrumb() {
  const pathname = usePathname();

  // Set breadcrumbs based on the current pathname
  const breadcrumbs = [
    { name: "Dashboard", href: "/manage/dashboard" },
    pathname !== "/manage/dashboard" && {
      name: breadcrumbMap[pathname] || "Unknown",
      href: pathname,
    },
  ].filter((item): item is { name: string; href: string } => Boolean(item)); // Type-safe filter

  return (
    <nav className="text-sm text-gray-500" aria-label="Breadcrumb">
      <ol className="flex space-x-2">
        {breadcrumbs.map((breadcrumb, index) => (
          <li key={index} className="flex items-center">
            <Link
              href={breadcrumb.href}
              className={`${
                index === breadcrumbs.length - 1
                  ? "font-semibold text-gray-700"
                  : "hover:text-blue-600"
              }`}
            >
              {breadcrumb.name}
            </Link>
            {index < breadcrumbs.length - 1 && (
              <span className="mx-2 text-gray-400">/</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
