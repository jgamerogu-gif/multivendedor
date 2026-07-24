import { UserButton } from "@clerk/nextjs";
import ThemeToggle from '../../shared/theme-toggle';

export default function Header() {
  return (
    <header className="fixed top-0 right-0 left-0 z-20 flex items-center border-b border-border bg-background/80 p-4 backdrop-blur-md md:left-75">
      <div className="ml-auto">
        <UserButton  />
        <ThemeToggle/>
      </div>
    </header>
  );
}