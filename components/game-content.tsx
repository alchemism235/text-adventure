// components/game-content.tsx
"use client";

import { useRef, useEffect } from "react";
import { Loader2 } from "lucide-react"; // 로딩 스피너 아이콘

interface GameContentProps {
  story: string;
  choices: string[];
  onChoiceSelected: (choice: string) => void;
  genre: string;
  isLoading: boolean;
  isGameEnded: boolean;
  currentTurn: number;
  // 🚨🚨🚨 새로 추가된 주관식 입력 관련 props 🚨🚨🚨
  customChoiceInput: string;
  onCustomChoiceInputChange: (value: string) => void;
  onCustomChoiceSubmit: () => void;
  // 🚨🚨🚨 설정에서 전달되는 폰트 스타일 props 🚨🚨🚨
  fontSize: number;
  fontFamily: string;
  // 🚨🚨🚨 스토리 요약 props 추가 🚨🚨🚨
  totalStorySummary: string;
}

export function GameContent({
  story,
  choices,
  onChoiceSelected,
  genre,
  isLoading,
  isGameEnded,
  currentTurn,
  customChoiceInput,
  onCustomChoiceInputChange,
  onCustomChoiceSubmit,
  fontSize, // 폰트 크기 props
  fontFamily, // 폰트 패밀리 props
  totalStorySummary, // 스토리 요약 props
}: GameContentProps) {
  const storyContainerRef = useRef<HTMLDivElement>(null);

  // 새 스토리가 로드될 때마다 스크롤을 맨 아래로 이동
  useEffect(() => {
    if (storyContainerRef.current) {
      storyContainerRef.current.scrollTop =
        storyContainerRef.current.scrollHeight;
    }
  }, [story]);

  // 엔터 키로 주관식 입력 전송
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      event.key === "Enter" &&
      customChoiceInput.trim() !== "" &&
      !isLoading
    ) {
      onCustomChoiceSubmit();
    }
  };

  return (
    <div className="flex flex-col flex-1 relative">
      {/* 로딩 스피너 오버레이 */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-70 z-10 rounded-lg">
          <Loader2 className="h-12 w-12 animate-spin text-purple-400" />
          <p className="ml-4 text-purple-400 text-lg">스토리 생성 중...</p>
        </div>
      )}

      {/* 스토리 영역 */}
      <div
        ref={storyContainerRef}
        className="flex-1 p-4 bg-gray-800 rounded-lg shadow-inner overflow-y-auto custom-scrollbar transition-colors duration-300"
        style={{ fontSize: `${fontSize}px`, fontFamily: fontFamily }} // 폰트 스타일 적용
      >
        <p className="whitespace-pre-wrap leading-relaxed">{story}</p>

        {/* 🚨🚨🚨 스토리 요약 표시 🚨🚨🚨 */}
        {totalStorySummary && (
          <div className="mt-6 p-4 bg-gray-700 rounded-lg border border-gray-600 text-gray-300 text-sm italic">
            <h3 className="font-bold text-gray-100 mb-2 border-b border-gray-600 pb-1">
              지금까지의 이야기 요약:
            </h3>
            <p className="whitespace-pre-wrap">{totalStorySummary}</p>
          </div>
        )}
      </div>

      {/* 게임 상태 정보 */}
      <div className="mt-4 p-3 bg-gray-700 rounded-lg text-sm text-gray-300 flex justify-between items-center">
        <span>장르: {genre}</span>
        <span>턴 수: {currentTurn}</span>
      </div>

      {/* 선택지 버튼 및 주관식 입력 */}
      <div className="mt-4 p-4 bg-gray-800 rounded-lg flex flex-col items-center">
        {isGameEnded ? (
          <p className="text-lg text-red-400 font-bold">게임 종료!</p>
        ) : (
          <div className="w-full space-y-3">
            {choices.map((choice, index) => (
              <button
                key={index}
                onClick={() => onChoiceSelected(choice)}
                disabled={isLoading}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-md transition duration-300 ease-in-out shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {choice}
              </button>
            ))}
            {/* 🚨🚨🚨 주관식 입력 필드 및 버튼 🚨🚨🚨 */}
            <div className="flex w-full space-x-2 mt-4">
              <input
                type="text"
                placeholder="나만의 행동 입력..."
                value={customChoiceInput}
                onChange={(e) => onCustomChoiceInputChange(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
                className="flex-1 p-3 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              />
              <button
                onClick={onCustomChoiceSubmit}
                disabled={isLoading || customChoiceInput.trim() === ""}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md transition duration-300 ease-in-out shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                입력
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
