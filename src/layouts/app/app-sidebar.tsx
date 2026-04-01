import { Link } from "react-router-dom"
import { NavFooter } from "./components/NavFooter"
import { NavMain } from "./components/NavMain"
import { NavUser } from "./components/NavUser"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import AppLogo from "./components/app-logo"
import { useLocale, useTranslations } from "@/i18n"
import { mainNavItems, footerNavItems } from "./nav-items"

export function AppSidebar() {
  const common = useTranslations("common")
  const { dir } = useLocale()

  const translateItems = (items: any[]): any[] => {
    return items.map((item) => ({
      ...item,
      title: common(`nav.${item.id}`),
      items: item.items ? translateItems(item.items) : undefined,
    }))
  }

  const translatedNav = translateItems(mainNavItems)

  return (
    <Sidebar side={dir === "rtl" ? "right" : "left"} collapsible="icon" variant="inset" className="dark:bg-slate-950">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/home">
                <AppLogo />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={translatedNav} />
      </SidebarContent>

      <SidebarFooter>
        <NavFooter items={footerNavItems} />
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
