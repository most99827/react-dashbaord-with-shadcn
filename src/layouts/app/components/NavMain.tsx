import { Link } from "react-router-dom"
import { ChevronRight } from "lucide-react"

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { useActiveUrl } from "@/hooks/use-active-url"
import type { NavItem } from "./NavFooter"

export type NavTreeItem = NavItem & {
  items?: NavTreeItem[]
}

export function NavMain({ items = [] }: { items: NavTreeItem[] }) {
  const { urlIsActive } = useActiveUrl()

  const isAnyChildActive = (items?: NavTreeItem[]): boolean => {
    return items?.some(item => urlIsActive(item.href) || isAnyChildActive(item.items)) ?? false
  }

  const renderNavItem = (item: NavTreeItem, isSub = false) => {
    const Icon = item.icon
    const hasItems = item.items && item.items.length > 0
    const isActive = urlIsActive(item.href) || isAnyChildActive(item.items)

    if (hasItems) {
      const ItemWrapper = isSub ? SidebarMenuSubItem : SidebarMenuItem
      const ButtonWrapper = isSub ? SidebarMenuSubButton : SidebarMenuButton

      return (
        <Collapsible
          key={item.title}
          asChild
          defaultOpen={isActive}
          className="group/collapsible"
        >
          <ItemWrapper>
            <CollapsibleTrigger asChild>
              <ButtonWrapper tooltip={item.title} isActive={urlIsActive(item.href)}>
                {Icon ? <Icon /> : null}
                <span>{item.title}</span>
                <ChevronRight className="ms-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
              </ButtonWrapper>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                {item.items?.map((subItem) => renderNavItem(subItem, true))}
              </SidebarMenuSub>
            </CollapsibleContent>
          </ItemWrapper>
        </Collapsible>
      )
    }

    const ItemWrapper = isSub ? SidebarMenuSubItem : SidebarMenuItem
    const ButtonWrapper = isSub ? SidebarMenuSubButton : SidebarMenuButton

    return (
      <ItemWrapper key={item.title}>
        <ButtonWrapper asChild isActive={urlIsActive(item.href)} tooltip={item.title}>
          <Link to={item.href}>
            {Icon ? <Icon /> : null}
            <span>{item.title}</span>
          </Link>
        </ButtonWrapper>
      </ItemWrapper>
    )
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => renderNavItem(item))}
      </SidebarMenu>
    </SidebarGroup>
  )
}

