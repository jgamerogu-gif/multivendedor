import type { User } from "@clerk/nextjs/server";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface UserInfoProps {
  user: User | null;
  isAdmin: boolean;
}

export default function UserInfo({
  user,
  isAdmin,
}: UserInfoProps) {
  if (!user) {
    return null;
  }

  const firstName = user.firstName ?? "Usuario";
  const lastName = user.lastName ?? "";
  const fullName = `${firstName} ${lastName}`.trim();

  const email =
    user.emailAddresses[0]?.emailAddress ??
    "Correo no disponible";

  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`
    .toUpperCase()
    .trim();

  const dashboardName = isAdmin
    ? "Admin Dashboard"
    : "Seller Dashboard";

  return (
    <div className="flex w-full flex-col items-center text-center">
      <Avatar className="h-16 w-16 border shadow-sm">
        <AvatarImage
          src={user.imageUrl}
          alt={fullName}
        />

        <AvatarFallback className="bg-primary text-primary-foreground">
          {initials || "U"}
        </AvatarFallback>
      </Avatar>

      <div className="mt-3 min-w-0 max-w-full">
        <p className="truncate text-sm font-semibold">
          {fullName}
        </p>

        <p className="mt-1 truncate text-xs text-muted-foreground">
          {email}
        </p>

        <Badge
          variant="secondary"
          className="mt-2 text-xs font-medium"
        >
          {dashboardName}
        </Badge>
      </div>
    </div>
  );
}