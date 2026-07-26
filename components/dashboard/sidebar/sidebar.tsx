import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";

import Logo from "@/components/shared/logo";
import UserInfo from "@/components/dashboard/sidebar/user-info";

interface SidebarProps {
  isAdmin: boolean;
}

const menuItems = [
  {
    label: "Dashboard",
    href: "/dashboard/admin",
  },
  {
    label: "Productos",
    href: "/dashboard/admin/products",
  },
  {
    label: "Categorías",
    href: "/dashboard/admin/categories",
  },
  {
    label: "Pedidos",
    href: "/dashboard/admin/orders",
  },
  {
    label: "Usuarios",
    href: "/dashboard/admin/users",
  },
  {
    label: "Configuración",
    href: "/dashboard/admin/settings",
  },
];

function SidebarMenu() {
  return (
    <nav className="mt-6 flex w-full flex-col gap-1">
      {menuItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="
            rounded-lg px-4 py-3
            text-sm font-medium
            text-muted-foreground
            transition-colors duration-150
            hover:bg-muted
            hover:text-foreground
          "
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

const Sidebar = async ({ isAdmin }: SidebarProps) => {
  const user = await currentUser();

  return (
    <>
      {/* MÓVIL */}
      <aside className="w-full bg-background px-4 pb-6 pt-5 md:hidden">
        <div
          className="
            mx-auto flex w-full max-w-sm
            flex-col items-center
            rounded-2xl border
            bg-card p-5
            shadow-sm
          "
        >
          {/* Logo */}
          <div className="flex justify-center">
            <Logo width="120px" height="120px" />
          </div>

          {/* Información del usuario */}
          <div className="mt-2 w-full">
            <UserInfo user={user} isAdmin={isAdmin} />
          </div>

          {/* Separador */}
          <div className="my-2 h-px w-full bg-border" />

          {/* Menú */}
          <SidebarMenu />
        </div>
      </aside>

      {/* TABLET Y ESCRITORIO */}
      <aside
        className="
          fixed inset-y-0 left-0 z-40
          hidden flex-col
          overflow-y-auto border-r
          bg-background p-4
          md:flex md:w-[240px]
          lg:w-[300px]
        "
      >
        <div className="flex justify-center">
          <Logo width="150px" height="150px" />
        </div>

        <UserInfo user={user} isAdmin={isAdmin} />

        <div className="my-2 h-px w-full bg-border" />

        <SidebarMenu />
      </aside>
    </>
  );
};

export default Sidebar;