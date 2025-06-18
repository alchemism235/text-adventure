// components/game-sidebar.tsx
"use client"; // 이 컴포넌트는 클라이언트에서 실행되어야 합니다.

import { Home, Save, FolderOpen, Settings, Info } from "lucide-react"; // 아이콘 임포트
import {
  SidebarHeader,
  SidebarBody,
  SidebarItem,
  SidebarNav,
  SidebarNavLink,
  SidebarFooter,
  SidebarProvider, // SidebarProvider를 여기서 임포트하여 필요 시 사용할 수 있도록 합니다.
  useSidebar, // useSidebar 훅 임포트
  SidebarTrigger, // SidebarTrigger 임포트
  SidebarInset, // SidebarInset 임포트
} from "@/components/ui/sidebar"; // Sidebar UI 컴포넌트 임포트

// GameSidebar 컴포넌트의 props 정의
interface GameSidebarProps {
  onNewGame: () => void; // '새 게임' 버튼 클릭 시 호출될 함수
  onSaveGame: () => void; // '게임 저장' 버튼 클릭 시 호출될 함수
  onLoadGame: () => void; // '게임 불러오기' 버튼 클릭 시 호출될 함수
  onSettings: () => void; // '설정' 버튼 클릭 시 호출될 함수
  // userId prop은 로컬 스토리지 모드에서는 더 이상 사용되지 않습니다.
}

// 🚨�🚨 GameSidebar 컴포넌트를 'export' 합니다. 🚨🚨🚨
// 이 'export' 키워드가 있어야 다른 파일(예: app/page.tsx)에서 이 컴포넌트를 임포트하여 사용할 수 있습니다.
export function GameSidebar({
  onNewGame,
  onSaveGame,
  onLoadGame,
  onSettings,
}: GameSidebarProps) {
  return (
    // SidebarBody는 사이드바의 전체 컨테이너 역할을 하며, flex-direction: column을 적용합니다.
    <SidebarBody className="justify-between">
      {/* SidebarHeader: 사이드바의 상단 부분 (제목 또는 로고) */}
      <SidebarHeader>
        {/* SidebarNav: 내비게이션 링크들을 감싸는 컨테이너 */}
        <SidebarNav>
          {/* SidebarNavLink: 실제 클릭 가능한 내비게이션 링크 */}
          <SidebarNavLink href="/">AI Adventure</SidebarNavLink>
        </SidebarNav>
      </SidebarHeader>

      {/* SidebarNav: 주요 게임 기능 링크 그룹 */}
      <SidebarNav>
        {/* SidebarItem: 개별 내비게이션 항목 */}
        <SidebarItem>
          {/* onClick 핸들러를 통해 각 기능에 맞는 콜백 함수를 호출합니다. */}
          <SidebarNavLink onClick={onNewGame}>
            <Home className="h-5 w-5 mr-3" /> {/* 홈 아이콘 */}새 게임
          </SidebarNavLink>
        </SidebarItem>
        <SidebarItem>
          <SidebarNavLink onClick={onSaveGame}>
            <Save className="h-5 w-5 mr-3" /> {/* 저장 아이콘 */}
            게임 저장
          </SidebarNavLink>
        </SidebarItem>
        <SidebarItem>
          <SidebarNavLink onClick={onLoadGame}>
            <FolderOpen className="h-5 w-5 mr-3" /> {/* 폴더 열기 아이콘 */}
            게임 불러오기
          </SidebarNavLink>
        </SidebarItem>
        <SidebarItem>
          <SidebarNavLink onClick={onSettings}>
            <Settings className="h-5 w-5 mr-3" /> {/* 설정 아이콘 */}
            설정
          </SidebarNavLink>
        </SidebarItem>
      </SidebarNav>

      {/* SidebarFooter: 사이드바의 하단 부분 (정보 또는 저작권 표시) */}
      <SidebarFooter className="text-xs text-gray-500">
        <SidebarItem>
          <SidebarNavLink>
            <Info className="h-4 w-4 mr-2" /> {/* 정보 아이콘 */}
            {/* 로컬 스토리지 버전에서는 사용자 ID가 없으므로 '오프라인 모드'로 표시합니다. */}
            <span className="text-gray-400">오프라인 모드</span>
          </SidebarNavLink>
        </SidebarItem>
        <SidebarItem>
          {/* 저작권 문구 */}
          <p className="text-xs text-gray-500">
            © 2024 AI Text Adventure. All rights reserved.
          </p>
        </SidebarItem>
      </SidebarFooter>
    </SidebarBody>
  );
}
