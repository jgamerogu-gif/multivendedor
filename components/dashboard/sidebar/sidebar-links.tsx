
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  Package,
  Tags,
  ShoppingCart,
  Users,
  Settings,
} from "lucide-react";

interface SidebarLinksProps {
  onNavigate?: () => void;
}

const menuItems = [
  {
    label: "Dashboard",
    href: "/dashboard/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Productos",
    href: "/dashboard/admin/products",
    icon: Package,
  },
  {
    label: "Categorías",
    href: "/dashboard/admin/categories",
    icon: Tags,
  },
  {
    label: "Pedidos",
    href: "/dashboard/admin/orders",
    icon: ShoppingCart,
  },
  {
    label: "Usuarios",
    href: "/dashboard/admin/users",
    icon: Users,
  },
  {
    label: "Configuración",
    href: "/dashboard/admin/settings",
    icon: Settings,
  },
];

export default function SidebarLinks({
  onNavigate,
}: SidebarLinksProps) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navegación del administrador"
      className="flex w-full flex-col gap-1"
    >
      {menuItems.map((item) => {
        const Icon = item.icon;

        const isActive =
          pathname === item.href ||
          (item.href !== "/dashboard/admin" &&
            pathname.startsWith(`${item.href}/`));

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={isActive ? "page" : undefined}
            className={`
              flex min-h-11 items-center gap-3
              rounded-lg px-4 py-3
              text-sm font-medium
              transition-colors duration-150
              ${
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }
            `}
          >
            <Icon
              className="h-5 w-5 shrink-0"
              aria-hidden="true"
            />

            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
