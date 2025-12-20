import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

export default function AuthenticatedLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <main className="flex-1 overflow-auto">
                <div className="flex h-16 items-center border-b px-4">
                    <SidebarTrigger />
                </div>
                <div className="p-4 md:p-8 pt-6">
                    {children}
                </div>
            </main>
        </SidebarProvider>
    )
}
