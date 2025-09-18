import { SidebarTrigger } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { currentUser } from "@/lib/data";
import { ThemeToggle } from "./theme-toggle";

type AppHeaderProps = {
  title: string;
};

export function AppHeader({ title }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
      <SidebarTrigger className="md:hidden" />
      <h1 className="flex-1 text-xl font-semibold tracking-tight">{title}</h1>
      <ThemeToggle />
      <Avatar>
        <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
        <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
      </Avatar>
    </header>
  );
}
