// components/ui/sidebar.tsx
"use client"; // 이 컴포넌트는 클라이언트에서 실행되어야 합니다.

import * as React from "react";
import { cva } from "class-variance-authority"; // Tailwind CSS 클래스를 조건부로 적용하는 유틸리티
import { cn } from "@/lib/utils"; // Tailwind CSS 클래스 병합 유틸리티 (필요시 이 파일도 확인)

// Sidebar Context를 생성하여 사이드바 열림/닫힘 상태를 관리합니다.
interface SidebarContextType {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const SidebarContext = React.createContext<SidebarContextType | undefined>(
  undefined
);

// SidebarProvider: 사이드바 상태를 제공하는 컴포넌트입니다.
// 이 Provider로 감싸진 모든 자식 컴포넌트에서 useSidebar 훅을 통해 사이드바 상태에 접근할 수 있습니다.
export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(false); // 사이드바 열림 상태

  return (
    <SidebarContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </SidebarContext.Provider>
  );
}

// useSidebar: SidebarContext에 접근하는 커스텀 훅입니다.
// 이 훅을 사용하여 사이드바의 현재 열림 상태를 확인하고, 상태를 변경할 수 있습니다.
export function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}

// SidebarBody: 사이드바의 메인 컨테이너 컴포넌트입니다.
// 사이드바의 위치, 크기, 배경색, 전환 효과 등을 정의합니다.
const sidebarBodyVariants = cva(
  "fixed top-0 left-0 h-full w-64 bg-gray-900 border-r border-gray-800 transition-transform duration-300 ease-in-out z-40 flex flex-col",
  {
    variants: {
      isOpen: {
        true: "translate-x-0", // 사이드바가 열렸을 때 (화면 안으로 이동)
        false: "-translate-x-full", // 사이드바가 닫혔을 때 (화면 밖으로 이동)
      },
    },
    defaultVariants: {
      isOpen: false,
    },
  }
);

interface SidebarBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen?: boolean; // SidebarProvider의 isOpen 상태를 직접 받을 수도 있습니다. (선택 사항)
}

export const SidebarBody = React.forwardRef<HTMLDivElement, SidebarBodyProps>(
  ({ className, isOpen: propIsOpen, ...props }, ref) => {
    const { isOpen: contextIsOpen } = useSidebar(); // Context에서 isOpen 상태를 가져옵니다.
    const actualIsOpen = propIsOpen !== undefined ? propIsOpen : contextIsOpen; // prop이 있으면 prop 사용, 없으면 context 사용

    return (
      <div
        ref={ref}
        className={cn(sidebarBodyVariants({ isOpen: actualIsOpen }), className)}
        {...props}
      />
    );
  }
);
SidebarBody.displayName = "SidebarBody";

// SidebarTrigger: 사이드바를 열고 닫는 버튼 (햄버거 메뉴 등) 컴포넌트입니다.
interface SidebarTriggerProps extends React.HTMLAttributes<HTMLButtonElement> {}

export const SidebarTrigger = React.forwardRef<
  HTMLButtonElement,
  SidebarTriggerProps
>(({ className, onClick, ...props }, ref) => {
  const { isOpen, setIsOpen } = useSidebar();
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setIsOpen(!isOpen); // 클릭 시 사이드바 상태를 토글합니다.
    onClick?.(e); // prop으로 전달된 onClick 함수가 있다면 호출합니다.
  };

  return (
    <button
      ref={ref}
      className={cn(
        "p-2 rounded-md hover:bg-gray-800 text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500",
        className
      )}
      onClick={handleClick}
      {...props}
    />
  );
});
SidebarTrigger.displayName = "SidebarTrigger";

// SidebarInset: 사이드바가 열렸을 때 메인 콘텐츠를 밀어내는 역할 (오버레이 또는 여백) 컴포넌트입니다.
// 사이드바 너비만큼 메인 콘텐츠를 오른쪽으로 이동시켜 사이드바가 덮어쓰지 않도록 합니다.
const sidebarInsetVariants = cva(
  "flex-1 transition-transform duration-300 ease-in-out",
  {
    variants: {
      isOpen: {
        true: "ml-64", // 사이드바 너비(64)만큼 왼쪽 여백을 줍니다.
        false: "ml-0", // 닫혔을 때는 여백이 없습니다.
      },
    },
    defaultVariants: {
      isOpen: false,
    },
  }
);

interface SidebarInsetProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen?: boolean;
}

export const SidebarInset = React.forwardRef<HTMLDivElement, SidebarInsetProps>(
  ({ className, isOpen: propIsOpen, ...props }, ref) => {
    const { isOpen: contextIsOpen } = useSidebar();
    const actualIsOpen = propIsOpen !== undefined ? propIsOpen : contextIsOpen;

    return (
      <div
        ref={ref}
        className={cn(
          sidebarInsetVariants({ isOpen: actualIsOpen }),
          className
        )}
        {...props}
      />
    );
  }
);
SidebarInset.displayName = "SidebarInset";

// SidebarHeader: 사이드바 내부의 상단 헤더 영역 컴포넌트입니다.
interface SidebarHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  SidebarHeaderProps
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("p-4 border-b border-gray-700", className)}
    {...props}
  />
));
SidebarHeader.displayName = "SidebarHeader";

// SidebarNav: 사이드바 내부의 탐색 링크들을 감싸는 컨테이너 컴포넌트입니다.
interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {}

export const SidebarNav = React.forwardRef<HTMLElement, SidebarNavProps>(
  ({ className, ...props }, ref) => (
    <nav
      ref={ref}
      className={cn("flex flex-col p-2 space-y-1", className)}
      {...props}
    />
  )
);
SidebarNav.displayName = "SidebarNav";

// SidebarItem: 사이드바 내 개별 항목을 나타내는 컴포넌트입니다.
interface SidebarItemProps extends React.HTMLAttributes<HTMLDivElement> {}

export const SidebarItem = React.forwardRef<HTMLDivElement, SidebarItemProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex items-center text-gray-300 hover:bg-gray-800 rounded-md py-2 px-3",
        className
      )}
      {...props}
    />
  )
);
SidebarItem.displayName = "SidebarItem";

// SidebarNavLink: 사이드바 내에서 클릭 가능한 탐색 링크 컴포넌트입니다.
interface SidebarNavLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {}

export const SidebarNavLink = React.forwardRef<
  HTMLAnchorElement,
  SidebarNavLinkProps
>(({ className, ...props }, ref) => (
  <a
    ref={ref}
    className={cn(
      "flex items-center w-full text-left cursor-pointer",
      className
    )}
    {...props}
  />
));
SidebarNavLink.displayName = "SidebarNavLink";

// SidebarFooter: 사이드바 내부의 하단 푸터 영역 컴포넌트입니다.
interface SidebarFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

export const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  SidebarFooterProps
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("p-4 border-t border-gray-700 mt-auto", className)}
    {...props}
  />
));
SidebarFooter.displayName = "SidebarFooter";
