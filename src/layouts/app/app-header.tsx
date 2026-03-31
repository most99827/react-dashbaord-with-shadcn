import { Bell, ChevronDown, HelpCircle, Menu, Search } from "lucide-react"
import { Link } from "react-router-dom"

import { useAuth } from "@/auth/useAuth"
import AppLogo from "./components/app-logo"
import AppLogoIcon from "./components/app-logo-icon"
import { mainNavItems } from "./nav-items"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useLocale, useTranslations } from "@/i18n"
import { useActiveUrl } from "@/hooks/use-active-url"
import { cn } from "@/lib/utils"
import { Breadcrumbs, type BreadcrumbItemType } from "./components/Breadcrumbs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { UserMenuContent } from "./components/UserMenuContent"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function AppHeader({ breadcrumbs = [] }: { breadcrumbs?: BreadcrumbItemType[] }) {
  const { user } = useAuth()
  const common = useTranslations("common")
  const { urlIsActive } = useActiveUrl()

  const translateItems = (items: any[]): any[] => {
    return items.map((item) => ({
      ...item,
      title: common.nav[item.id as keyof typeof common.nav] || item.id,
      items: item.items ? translateItems(item.items) : undefined,
    }))
  }

  const translatedNav = translateItems(mainNavItems)

  const NavHeaderItem = ({ item }: { item: any }) => {
    const Icon = item.icon
    const hasItems = item.items && item.items.length > 0

    if (hasItems) {
      return (
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            {Icon && <Icon className="mr-2 h-4 w-4" />}
            <span>{item.title}</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            {item.items.map((sub: any) => (
              <NavHeaderItem key={sub.title} item={sub} />
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      )
    }

    return (
      <DropdownMenuItem key={item.title} asChild>
        <Link
          to={item.href}
          className={cn(
            "flex w-full cursor-pointer items-center",
            urlIsActive(item.href) && "font-bold"
          )}
        >
          {Icon && <Icon className="mr-2 h-4 w-4" />}
          <span>{item.title}</span>
        </Link>
      </DropdownMenuItem>
    )
  }

  const NavMobileItem = ({ item, depth = 0 }: { item: any; depth?: number }) => {
    const Icon = item.icon
    const hasItems = item.items && item.items.length > 0
    const isActive = urlIsActive(item.href) || (item.items?.some((sub: any) => urlIsActive(sub.href)))

    return (
      <div key={item.title} className={cn(depth > 0 && "ml-4 pl-4 border-l border-neutral-200 dark:border-neutral-700")}>
        {hasItems ? (
          <div className="flex flex-col space-y-2">
            <div className={cn("flex items-center space-x-2 font-medium opacity-80", isActive && "opacity-100 text-slate-900 dark:text-slate-100")}>
              {Icon && <Icon className="h-5 w-5" />}
              <span>{item.title}</span>
            </div>
            <div className="flex flex-col space-y-2">
              {item.items.map((sub: any) => (
                <NavMobileItem key={sub.title} item={sub} depth={depth + 1} />
              ))}
            </div>
          </div>
        ) : (
          <Link to={item.href} className={cn("flex items-center space-x-2 font-medium", isActive && "text-slate-900 dark:text-slate-100 font-bold")}>
            {Icon && <Icon className="h-5 w-5" />}
            <span>{item.title}</span>
          </Link>
        )}
      </div>
    )
  }

  const { dir } = useLocale()

  return (
    <>
      <div className="border-b border-sidebar-border/80 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
        <div className="mx-auto flex h-16 items-center px-4 md:max-w-7xl">
          {/* Mobile Menu */}
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="mr-2 h-[34px] w-[34px]">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side={dir === "rtl" ? "right" : "left"} className="flex h-full w-64 flex-col items-stretch justify-between bg-white dark:bg-slate-950">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <SheetHeader className="flex justify-start text-start px-4 pt-4">
                  <AppLogoIcon className="h-6 w-6 fill-current text-black dark:text-white" />
                </SheetHeader>
                <div className="flex h-full flex-1 flex-col space-y-4 p-4 overflow-y-auto">
                  <nav className="flex flex-col space-y-4">
                    {translatedNav.map((item: any) => (
                      <NavMobileItem key={item.title} item={item} />
                    ))}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <Link to="/home" className="flex items-center gap-2">
            <AppLogo />
          </Link>

          <div className="ms-6 hidden h-full items-center space-x-1 space-x-reverse lg:flex">
            {translatedNav.map((item: any) => {
              const Icon = item.icon
              const active = urlIsActive(item.href) || (item.items?.some((sub: any) => urlIsActive(sub.href)))

              return (
                <div key={item.title} className="relative flex h-full items-center px-1">
                  {item.items ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        className={cn(
                          navigationMenuTriggerStyle(),
                          'group h-9 cursor-pointer px-3',
                          active && "bg-slate-100 text-slate-950 dark:bg-slate-800 dark:text-white"
                        )}
                      >
                        {item.icon && (
                          <Icon
                            className="me-2 h-4 w-4"
                          />
                        )}
                        {item.title}
                        <ChevronDown
                          className="relative top-[1px] ms-1 h-3 w-3 transition duration-300 group-data-[state=open]:rotate-180"
                          aria-hidden="true"
                        />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="start"
                        className="w-48"
                      >
                        {item.items.map((subItem: any) => (
                          <NavHeaderItem key={subItem.title} item={subItem} />
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <Link
                      to={item.href}
                      className={cn(
                        navigationMenuTriggerStyle(),
                        "h-9 px-3",
                        active && "bg-slate-100 text-slate-950 dark:bg-slate-800 dark:text-white"
                      )}
                    >
                      {Icon && <Icon className="me-2 h-4 w-4" />}
                      <span>{item.title}</span>
                    </Link>
                  )}
                    {active && (
                      <div className="absolute bottom-0 start-1 end-1 h-0.5 bg-black dark:bg-white" />
                    )}
                  </div>
              )
            })}
          </div>

          <div className="ms-auto flex items-center gap-2">
            <div className="relative hidden w-64 xl:block">
              <Search className="pointer-events-none absolute start-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input className="h-9 rounded-lg ps-8" placeholder="Search..." />
            </div>

            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="size-9 lg:hidden">
                <Search className="size-5" />
              </Button>

              <Button type="button" variant="ghost" size="icon" className="size-9">
                <Bell className="size-5" />
              </Button>

              <Button type="button" variant="ghost" size="icon" className="size-9">
                <HelpCircle className="size-5" />
              </Button>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="ms-2 size-9 overflow-hidden rounded-full transition-opacity hover:opacity-80">
                  <Avatar className="size-8">
                    <AvatarImage src={user?.photo || ""} alt={user?.username || "User"} />
                    <AvatarFallback className="bg-slate-100 dark:bg-slate-800">
                      {user?.username?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <UserMenuContent user={user as any} />
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {breadcrumbs.length > 1 && (
        <div className="border-b border-sidebar-border/70 bg-white/50 px-4 dark:border-slate-800/60 dark:bg-slate-950/50">
          <div className="mx-auto flex h-12 items-center justify-start md:max-w-7xl">
            <Breadcrumbs breadcrumbs={breadcrumbs} />
          </div>
        </div>
      )}
    </>
  )
}
