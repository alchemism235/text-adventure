"use client";

import { Save, FileInput, Settings, HelpCircle, Play } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

interface GameSidebarProps {
  onNewGame: () => void;
}

export function GameSidebar({ onNewGame }: GameSidebarProps) {
  return (
    <Sidebar className="border-r border-gray-800">
      <SidebarHeader className="border-b border-gray-800">
        <div className="p-2">
          <h2 className="text-xl font-bold text-purple-300">Game Menu</h2>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={onNewGame}
              className="hover:bg-gray-800"
            >
              <Play className="mr-2 h-5 w-5" />
              <span>새 게임</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton className="hover:bg-gray-800">
              <Save className="mr-2 h-5 w-5" />
              <span>게임 저장 (미구현)</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton className="hover:bg-gray-800">
              <FileInput className="mr-2 h-5 w-5" />
              <span>게임 불러오기 (미구현)</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton className="hover:bg-gray-800">
              <Settings className="mr-2 h-5 w-5" />
              <span>설정 (미구현)</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton className="hover:bg-gray-800">
              <HelpCircle className="mr-2 h-5 w-5" />
              <span>도움말 (미구현)</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
