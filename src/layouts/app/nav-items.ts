import { LayoutGrid, Settings, Shield, Store, Users } from "lucide-react"
import { type NavTreeItem } from "./components/NavMain"

export const mainNavItems: Omit<NavTreeItem, 'title'>[] = [
  {
    id: "workspace",
    href: "/home",
    icon: LayoutGrid,
  },
  {
    id: "setup",
    href: "#",
    icon: Settings,
    items: [
      {
        id: "marketplaces",
        href: "/marketplaces",
        icon: Store,
      },
      {
        id: "users",
        href: "/users",
        icon: Users,
      },
      {
        id: "securityGroup",
        href: "/setup/groups",
        icon: Shield,
      },
      {
        id: "settings",
        href: "#",
        icon: Settings,
        items: [
          {
            id: "marketplaces",
            href: "/marketplaces",
            icon: Store,
          },
          {
            id: "users",
            href: "/users",
            icon: Users,
          },
          {
            id: "securityGroup",
            href: "/setup/groups",
            icon: Shield,
          },
        ],
      },
    ],
  },
] as any

export const footerNavItems: any[] = []
