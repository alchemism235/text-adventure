"use client";

import { Button } from "@/components/ui/button";

interface GenreSelectionProps {
  onSelectGenre: (genre: string) => void;
}

export function GenreSelection({ onSelectGenre }: GenreSelectionProps) {
  return (
    <div className="flex flex-col items-center justify-center flex-1 p-4 text-center">
      <h2 className="text-3xl font-bold text-purple-300 mb-6">
        장르를 선택하세요
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-lg">
        <Button
          onClick={() => onSelectGenre("Fantasy")}
          className="w-full h-24 text-xl font-semibold bg-blue-600 hover:bg-blue-700 text-white"
        >
          판타지
        </Button>
        <Button
          onClick={() => onSelectGenre("Sci-Fi")}
          className="w-full h-24 text-xl font-semibold bg-green-600 hover:bg-green-700 text-white"
        >
          공상과학
        </Button>
        <Button
          onClick={() => onSelectGenre("Mystery")}
          className="w-full h-24 text-xl font-semibold bg-red-600 hover:bg-red-700 text-white"
        >
          미스터리
        </Button>
      </div>
      <p className="mt-8 text-gray-400">
        선택한 장르에 따라 스토리가 시작됩니다. (AI는 나중에 연동됩니다)
      </p>
    </div>
  );
}
