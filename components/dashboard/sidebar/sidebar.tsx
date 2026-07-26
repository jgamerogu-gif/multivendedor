import type { FC } from "react";
import Logo from "@/components/shared/logo";

interface SidebarProps {
  isAdmin: boolean;
}

const Sidebar: FC<SidebarProps> = ({ isAdmin }) => {
  return (
    <aside className="fixed top-0 left-0 bottom-0 w-[300px] h-screen border-r p-4 flex flex-col">
      {/* Logo */}
      <div className="flex justify-center">
        <Logo width="180px" height="180px" />
      </div>

      {/* Espacio para el menú */}
      <div className="mt-6">
        {isAdmin && (
          <p className="text-sm font-semibold text-muted-foreground">
            Panel de Administración
          </p>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;