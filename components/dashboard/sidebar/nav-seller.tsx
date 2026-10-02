"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Warehouse,
  BadgePercent,
  Truck,
  Settings,
} from "lucide-react";

const menuItems = [
  {
    label: "Dashboard",
    link: "",
    icon: LayoutDashboard,
  },
  {
    label: "Productos",
    link: "products",
    icon: Package,
  },
  {
    label: "Pedidos",
    link: "orders",
    icon: ShoppingCart,
  },
  {
    label: "Inventario",
    link: "inventory",
    icon: Warehouse,
  },
  {
    label: "Cupones",
    link: "coupons",
    icon: BadgePercent,
  },
  {
    label: "Envíos",
    link: "shipping",
    icon: Truck,
  },
  {
    label: "Configuración",
    link: "settings",
    icon: Settings,
  },
];

interface NavSellerProps {
  onNavigate?: () => void;
}

export default function NavSeller({
  onNavigate,
}: NavSellerProps) {
  const pathname = usePathname();

  const segments = pathname.split("/");
  const activeStore = segments[4];

  if (!activeStore) {
    return null;
  }

  const storeBase = `/dashboard/seller/stores/${activeStore}`;

  return (
    <nav
      aria-label="Navegación del vendedor"
      className="flex w-full flex-col gap-1"
    >
      {menuItems.map((item) => {
        const Icon = item.icon;

        const href = item.link
          ? `${storeBase}/${item.link}`
          : storeBase;

        const isActive =
          pathname === href ||
          (item.link !== "" && pathname.startsWith(`${href}/`));

        return (
          <Link
            key={item.label}
            href={href}
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
