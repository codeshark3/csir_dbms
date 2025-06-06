import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "~/components/ui/sidebar";
import { AppSidebar } from "~/components/AppSidebar";

import { Separator } from "~/components/ui/separator";

export default function ProfileLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1>CSIR WRI DBMS</h1>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}

{
  /* <SidebarProvider>
          {" "}
          <AppSidebar />
          <main>
            <div className="flex h-screen flex-col">
              <SidebarTrigger /> {children}
            </div>
          </main>
        </SidebarProvider> */
}
