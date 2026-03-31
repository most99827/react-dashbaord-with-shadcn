import { BookOpen, Folder, LayoutGrid, Settings, Shield, Store, Truck, Users, type LucideIcon } from "lucide-react"

export type MenuChildItem = {
  title: string
  path: string
  icon: LucideIcon
}

export type MenuItem = {
  title: string
  path: string
  icon: LucideIcon
  children?: MenuChildItem[]
}

export const menu: MenuItem[] = [
  {
    title: "Workspace",
    path: "/home",
    icon: LayoutGrid,
  },
  {
    title: "Full Unload Van",
    path: "/full-unload-requests",
    icon: Truck,
  },
  {
    title: "Setup",
    path: "/setup",
    icon: Settings,
    children: [
      {
        title: "Marketplaces",
        path: "/marketplaces",
        icon: Store,
      },
      {
        title: "Users",
        path: "/users",
        icon: Users,
      },
      {
        title: "Security Group",
        path: "/security-group",
        icon: Shield,
      },
    ],
  },
]

export const footerMenu = [
  {
    title: "Repository",
    path: "#",
    icon: Folder,
  },
  {
    title: "Documentation",
    path: "#",
    icon: BookOpen,
  },
]
