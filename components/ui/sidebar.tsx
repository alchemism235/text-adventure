"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface SidebarContextType {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  toggleOpen: () => void;
}

const SidebarContext = React.createContext<SidebarContextType | undefined>(
  undefined
);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const toggleOpen = React.useCallback(() => setOpen((prev) => !prev), []);

  const value = React.useMemo(
    () => ({ open, setOpen, toggleOpen }),
    [open, setOpen, toggleOpen]
  );

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}

interface SidebarProps extends React.ComponentPropsWithoutRef<"aside"> {}

export function Sidebar({ className, ...props }: SidebarProps) {
  const { open } = useSidebar();
  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 transition-transform duration-300 ease-in-out",
        open ? "translate-x-0" : "-translate-x-full",
        className
      )}
      {...props}
    />
  );
}

interface SidebarContentProps extends React.ComponentPropsWithoutRef<"div"> {}

export function SidebarContent({ className, ...props }: SidebarContentProps) {
  return (
    <div className={cn("flex-1 overflow-y-auto p-4", className)} {...props} />
  );
}

interface SidebarHeaderProps extends React.ComponentPropsWithoutRef<"div"> {}

export function SidebarHeader({ className, ...props }: SidebarHeaderProps) {
  return (
    <div className={cn("flex items-center h-16 px-4", className)} {...props} />
  );
}

interface SidebarMenuProps extends React.ComponentPropsWithoutRef<"nav"> {}

export function SidebarMenu({ className, ...props }: SidebarMenuProps) {
  return <nav className={cn("space-y-1", className)} {...props} />;
}

interface SidebarMenuItemProps extends React.ComponentPropsWithoutRef<"div"> {}

export function SidebarMenuItem({ className, ...props }: SidebarMenuItemProps) {
  return <div className={cn("", className)} {...props} />;
}

interface SidebarMenuButtonProps
  extends React.ComponentPropsWithoutRef<"button"> {}

export function SidebarMenuButton({
  className,
  ...props
}: SidebarMenuButtonProps) {
  return (
    <button
      className={cn(
        "flex w-full items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-700",
        className
      )}
      {...props}
    />
  );
}

interface SidebarTriggerProps
  extends React.ComponentPropsWithoutRef<"button"> {}

export function SidebarTrigger({
  className,
  children,
  ...props
}: SidebarTriggerProps) {
  const { toggleOpen } = useSidebar();

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white",
        className
      )}
      onClick={toggleOpen}
      {...props}
    >
      {children}
    </button>
  );
}

interface SidebarInsetProps extends React.ComponentPropsWithoutRef<"div"> {}

export function SidebarInset({ className, ...props }: SidebarInsetProps) {
  const { open } = useSidebar();
  return (
    <div
      className={cn(
        "flex-1 transition-all duration-300 ease-in-out",
        open ? "lg:ml-64" : "ml-0",
        className
      )}
      {...props}
    />
  );
}
