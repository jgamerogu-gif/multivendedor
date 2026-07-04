import ThemeToggle from "@/components/shared/theme-toggle";
import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <main className="min-h-screen bg-background p-5 text-foreground">
      <div className="flex w-full items-center justify-end gap-5">
        <UserButton />
        <ThemeToggle />
      </div>

      <section className="mt-10">
        <h1 className="font-barlow text-5xl text-blue-500">
          Inicio
        </h1>

        <Button className="mt-4">
          Click here
        </Button>
      </section>
    </main>
  );
}