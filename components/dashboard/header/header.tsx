
import { UserButton } from "@clerk/nextjs";
import ThemeToggle from "@/components/shared/theme-toggle";
import MobileSidebar from "@/components/dashboard/sidebar/mobile-sidebar";

export default function Header() {
  return (
    <header
      className="
        fixed inset-x-0 top-0 z-30
        flex h-[75px] items-center
        justify-between border-b bg-background
        px-4
        md:left-[240px]
        md:justify-end
        lg:left-[300px]
      "
    >
      {/* Botón del menú: solo celulares */}
      <MobileSidebar />

      {/* Tema y cuenta */}
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <UserButton />
      </div>
    </header>
  );
}
