"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { User2, ChevronUp, ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useState } from "react";

export function AppSidebar({ session }: { session: any }) {
  const path = usePathname();
  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);

  // Menu items.
  const items = [
    {
      title: "Home",
      url: "/",
    },
    {
      title: "Master",
      items: [
        { title: "User", url: "/master/user" },
        { title: "Group", url: "/master/group" },
        { title: "Menu", url: "/master/menu" },
      ],
    },
    {
      title: "Kunjungan",
      items: [
        { title: "Record", url: "/kunjungan/record" },
        { title: "Report", url: "/kunjungan/report" },
      ],
    },
  ];

  const toggleSubMenu = (title: string) => {
    setOpenSubMenu(openSubMenu === title ? null : title);
  };

  return ["/login", "/logout"].includes(path) ? (
    <></>
  ) : (
    <Sidebar>
      <SidebarHeader className="shadow-sm flex flex-row w-full justify-center">
        <div className="font-black text-2xl text-white drop-shadow-[0.5px_1px_1px_rgba(0,0,0,1)]">
          R - <span className="text-orange-500">PKL</span>
        </div>
      </SidebarHeader>
      <hr />
      <SidebarContent className="overflow-x-hidden">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) =>
                item.items ? (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      onClick={() => toggleSubMenu(item.title)}
                      className="flex justify-between"
                    >
                      <span>{item.title}</span>
                      <ChevronRight
                        className={`transition-transform ${
                          openSubMenu === item.title ? "rotate-90" : ""
                        }`}
                      />
                    </SidebarMenuButton>
                    {openSubMenu === item.title && (
                      <SidebarMenu className="ml-4 border-l pl-2">
                        {item.items.map((subItem) => (
                          <SidebarMenuItem key={subItem.title}>
                            <SidebarMenuButton asChild>
                              <a href={subItem.url}>{subItem.title}</a>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        ))}
                      </SidebarMenu>
                    )}
                  </SidebarMenuItem>
                ) : (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url}>{item.title}</a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <hr />
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User2 /> {session?.user.name}
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <a href="/logout">
                  <DropdownMenuItem>Sign out</DropdownMenuItem>
                </a>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
