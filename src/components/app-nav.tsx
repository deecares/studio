"use client";

import {
  Car,
  CarTaxiFront,
  CreditCard,
  History,
  LayoutDashboard,
  MessageSquare,
  PlusCircle,
  Route,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarGroup,
  SidebarGroupLabel
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const AppNav = () => {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild className="h-10 w-10">
            <Link href="/dashboard">
              <CarTaxiFront className="text-primary" />
            </Link>
          </Button>
          <div className="flex flex-col">
            <h2 className="font-headline text-lg font-semibold tracking-tight">RideWise</h2>
          </div>
        </div>
      </SidebarHeader>

      <SidebarMenu>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isActive("/dashboard")}
              tooltip="Dashboard"
            >
              <Link href="/dashboard">
                <LayoutDashboard />
                <span>Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Rides</SidebarGroupLabel>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isActive("/request")}
              tooltip="Request a Ride"
            >
              <Link href="/request">
                <Car />
                <span>Request a Ride</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isActive("/offer")}
              tooltip="Offer a Ride"
            >
              <Link href="/offer">
                <PlusCircle />
                <span>Offer a Ride</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarGroup>

        <SidebarSeparator />
        
        <SidebarGroup>
          <SidebarGroupLabel>Activity</SidebarGroupLabel>
           <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isActive("/history")}
              tooltip="Ride History"
            >
              <Link href="/history">
                <History />
                <span>Ride History</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
           <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isActive("/payments")}
              tooltip="Payments"
            >
              <Link href="/payments">
                <CreditCard />
                <span>Payments</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isActive("/messages")}
              tooltip="Messages"
            >
              <Link href="/messages">
                <MessageSquare />
                <span>Messages</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarGroup>
      </SidebarMenu>
    </Sidebar>
  );
};

export default AppNav;
