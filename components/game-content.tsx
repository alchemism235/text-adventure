"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";

interface GameContentProps {
  story: string;
  choices: string[];
  onChoiceSelected: (choice: string) => void;
  genre: string;
  // AI 연동을 위해 추후 사용될 프롭들 (지금은 항상 false/0으로 전달)
  isLoading: boolean;
  isGameEnded: boolean;
  currentTurn: number;
}

export function GameContent({
  story,
  choices,
  onChoiceSelected,
  genre,
  isLoading,
  isGameEnded,
  currentTurn,
}: GameContentProps) {
  const storyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (storyRef.current) {
      storyRef.current.scrollTop = storyRef.current.scrollHeight;
    }
  }, [story, isLoading]);

  return (
    <div className="flex flex-col flex-1 p-4 bg-gray-800 rounded-lg shadow-lg relative overflow-hidden">
      <div className="mb-4">
        <span className="text-sm text-purple-400 font-medium">
          {genre} 어드벤처
        </span>
      </div>

      <div
        ref={storyRef}
        className="flex-1 bg-gray-800/50 rounded-lg p-6 mb-6 overflow-y-auto border border-gray-700"
      >
        <div className="prose prose-invert max-w-none">
          {story.split("\n").map((paragraph, index) => (
            <p key={index} className={index > 0 ? "mt-4" : ""}>
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-700 pt-4 mt-auto">
        {isGameEnded ? (
          <p className="text-center text-lg text-yellow-300">
            게임이 종료되었습니다! 새로운 모험을 시작하려면 사이드바를
            확인하세요.
          </p>
        ) : (
          <div className="grid gap-3">
            {choices.map((choice, index) => (
              <Button
                key={index}
                variant="outline"
                className="w-full py-6 text-left justify-start border border-gray-700 hover:bg-gray-800 hover:border-purple-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => onChoiceSelected(choice)}
                disabled={isLoading} // AI 연동 시 로딩 중일 때 비활성화
              >
                <span className="text-purple-400 mr-3">{index + 1}.</span>{" "}
                {choice}
              </Button>
            ))}
          </div>
        )}
      </div>

      {!isGameEnded && currentTurn > 0 && (
        <p className="text-center text-gray-500 text-sm mt-4">
          현재 턴: {currentTurn}
        </p>
      )}

      {/* 로딩 스피너: isLoading이 true일 때만 표시됩니다. 현재는 page.tsx에서 false로 전달 */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center rounded-lg">
          <svg
            className="animate-spin h-10 w-10 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
      )}
    </div>
  );
}
