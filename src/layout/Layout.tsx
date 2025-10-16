import { AppSidebar } from "./AppSidebar";
import Header from "./Header";
import { Outlet } from "react-router";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function Layout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <Header />
        <div className="mx-auto max-w-7xl p-3 sm:p-5 md:px-8">
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
  );
}
