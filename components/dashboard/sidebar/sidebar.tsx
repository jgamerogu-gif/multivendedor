
import { currentUser } from "@clerk/nextjs/server";

import Logo from "@/components/shared/logo";
import UserInfo from "@/components/dashboard/sidebar/user-info";
import SidebarLinks from "./sidebar-links";
import NavSeller from "./nav-seller";

interface SidebarProps {
  isAdmin: boolean;
}

export default async function Sidebar({
  isAdmin,
}: SidebarProps) {
  const user = await currentUser();

  return (
 <aside
  className="
    fixed inset-y-0 left-0 z-40
    hidden flex-col overflow-y-auto
    border-r bg-background p-4
    xl:flex xl:w-[300px]
  "
>
      <div className="flex justify-center">
        <Logo width="150px" height="150px" />
      </div>

      <UserInfo user={user} isAdmin={isAdmin} />

      <div className="my-2 h-px w-full bg-border" />

      {isAdmin ? <SidebarLinks /> : <NavSeller />}
    </aside>
  );
}
