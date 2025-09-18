import AppNav from "@/components/app-nav";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppNav />
      <SidebarInset>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
