
import { UserButton } from "@clerk/nextjs";
import ThemeToggle from "@/components/shared/theme-toggle";
import MobileSidebar from "@/components/dashboard/sidebar/mobile-sidebar";


interface HeaderProps {
  isAdmin?: boolean;
}

export default function Header({
  isAdmin = true,
}: HeaderProps) {

  return (
 <header
  className="
    fixed inset-x-0 top-0 z-30
    flex h-[75px] items-center
    justify-between border-b bg-background
    px-4
    xl:left-[300px]
    xl:justify-end
  "
>
      {/* Botón del menú: solo celulares */}
      <MobileSidebar isAdmin={isAdmin} />

      {/* Tema y cuenta */}
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <UserButton />
      </div>
    </header>
  );
}
