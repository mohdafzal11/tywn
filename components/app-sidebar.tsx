"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Brain, LayoutDashboard, Settings, LogOut, Moon, Sun, User } from "lucide-react"
import { useTheme } from "next-themes"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
    SidebarSeparator,
} from "@/components/ui/sidebar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useUser } from "@/hooks/use-user"

const navItems = [
    {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Personalities",
        href: "/personalities",
        icon: Brain,
    },
    {
        title: "Settings",
        href: "/settings",
        icon: Settings,
    },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const pathname = usePathname()
    const { user, loading, logout } = useUser()
    const { setTheme, theme } = useTheme()

    return (
        <Sidebar collapsible="icon" {...props}>
            {/* Header with Logo */}
            <SidebarHeader className="border-b">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild className="hover:bg-accent">
                            <Link href="/">
                                <div className="flex aspect-square size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground overflow-hidden">
                                    <img 
                                        src="/light-logo.png" 
                                        alt="Tywn" 
                                        className="dark:hidden size-full object-contain" 
                                    />
                                    <img 
                                        src="/dark-logo.png" 
                                        alt="Tywn" 
                                        className="hidden dark:block size-full object-contain" 
                                    />
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-bold text-base">Tywn</span>
                                    <span className="truncate text-xs text-muted-foreground">AI Social Manager</span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            {/* Navigation Content */}
            <SidebarContent className="pt-4">
                <SidebarMenu className="gap-1">
                    {navItems.map((item) => (
                        <SidebarMenuItem key={item.href}>
                            <SidebarMenuButton 
                                asChild 
                                isActive={pathname === item.href}
                                tooltip={item.title}
                                className="h-11 group-data-[collapsible=icon]:justify-center"
                            >
                                <Link href={item.href}>
                                    <item.icon className="size-5" />
                                    <span className="font-medium group-data-[collapsible=icon]:hidden">{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarContent>

            {/* Footer with User Menu */}
            <SidebarFooter className="border-t">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton
                                    size="lg"
                                    className="data-[state=open]:bg-accent data-[state=open]:text-accent-foreground h-14"
                                >
                                    {loading ? (
                                        <>
                                            <div className="h-9 w-9 rounded-lg bg-muted animate-pulse" />
                                            <div className="grid flex-1 text-left text-sm leading-tight">
                                                <div className="h-3 bg-muted rounded animate-pulse w-20 mb-1" />
                                                <div className="h-2 bg-muted rounded animate-pulse w-16" />
                                            </div>
                                        </>
                                    ) : user ? (
                                        <>
                                            <Avatar className="h-9 w-9 rounded-lg border-2">
                                                <AvatarImage 
                                                    src={user.profileImageUrl || undefined} 
                                                    alt={user.displayName || user.username} 
                                                />
                                                <AvatarFallback className="rounded-lg bg-primary text-primary-foreground font-semibold">
                                                    {(user.displayName || user.username || 'U').charAt(0).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="grid flex-1 text-left text-sm leading-tight">
                                                <span className="truncate font-semibold">
                                                    {user.displayName || user.username || 'User'}
                                                </span>
                                                <span className="truncate text-xs text-muted-foreground">
                                                    @{user.username || 'user'}
                                                </span>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <Avatar className="h-9 w-9 rounded-lg border-2 border-dashed">
                                                <AvatarFallback className="rounded-lg bg-muted">
                                                    <User className="h-5 w-5 text-muted-foreground" />
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="grid flex-1 text-left text-sm leading-tight">
                                                <span className="truncate font-semibold">Not logged in</span>
                                                <span className="truncate text-xs text-muted-foreground">Please sign in</span>
                                            </div>
                                        </>
                                    )}
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                className="w-56 rounded-lg"
                                side="bottom"
                                align="end"
                                sideOffset={4}
                            >
                                {user ? (
                                    <>
                                        <DropdownMenuLabel className="p-0 font-normal">
                                            <div className="flex items-center gap-3 px-2 py-2 text-left text-sm">
                                                <Avatar className="h-9 w-9 rounded-lg border-2">
                                                    <AvatarImage 
                                                        src={user.profileImageUrl || undefined} 
                                                        alt={user.displayName || user.username} 
                                                    />
                                                    <AvatarFallback className="rounded-lg bg-primary text-primary-foreground font-semibold">
                                                        {(user.displayName || user.username || 'U').charAt(0).toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="grid flex-1 text-left text-sm leading-tight">
                                                    <span className="truncate font-semibold">
                                                        {user.displayName || user.username || 'User'}
                                                    </span>
                                                    <span className="truncate text-xs text-muted-foreground">
                                                        @{user.username || 'user'}
                                                    </span>
                                                </div>
                                            </div>
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                                            {theme === "dark" ? (
                                                <Sun className="mr-2 size-4" />
                                            ) : (
                                                <Moon className="mr-2 size-4" />
                                            )}
                                            <span>Toggle {theme === "dark" ? "Light" : "Dark"} Mode</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem 
                                            onClick={logout}
                                            className="text-destructive focus:text-destructive focus:bg-destructive/10"
                                        >
                                            <LogOut className="mr-2 size-4" />
                                            <span>Log out</span>
                                        </DropdownMenuItem>
                                    </>
                                ) : (
                                    <>
                                        <DropdownMenuLabel>
                                            <span className="text-sm font-semibold">Not Logged In</span>
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                                            {theme === "dark" ? (
                                                <Sun className="mr-2 size-4" />
                                            ) : (
                                                <Moon className="mr-2 size-4" />
                                            )}
                                            <span>Toggle {theme === "dark" ? "Light" : "Dark"} Mode</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem asChild>
                                            <Link href="/login" className="cursor-pointer">
                                                <User className="mr-2 size-4" />
                                                <span>Sign In</span>
                                            </Link>
                                        </DropdownMenuItem>
                                    </>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
            
            <SidebarRail />
        </Sidebar>
    )
}
