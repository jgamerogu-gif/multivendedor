import { UserButton } from "@clerk/nextjs";
import ThemeToggle from "@/components/shared/theme-toggle";

export default function Header() {
  return (
    <header
      className="
        fixed top-0 right-0 left-0 z-30
        h-[75px]
        border-b
        bg-background
        flex items-center justify-end
        px-4

        md:left-[240px]
        lg:left-[300px]
      "
    >
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <UserButton />
      </div>
    </header>
  );
}