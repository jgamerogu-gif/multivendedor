import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface BackLinkProps {
  href: string;
  label: string;
}

export default function BackLink({
  href,
  label,
}: BackLinkProps) {
  return (
    <Link
      href={href}
      className="
        inline-flex items-center gap-2
        text-sm font-medium text-muted-foreground
        transition-colors hover:text-foreground
      "
    >
      <ArrowLeft className="h-4 w-4" />
      {label}
    </Link>
  );
}

