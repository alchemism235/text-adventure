// components/genre-selection.tsx
"use client";

import { useState } from "react"; // React의 상태(state) 훅을 임포트합니다.
import { BookOpen, Rocket, Search } from "lucide-react"; // 장르 아이콘들을 임포트합니다.

// GenreSelection 컴포넌트의 props 정의
interface GenreSelectionProps {
  onSelectGenre: (genre: string) => void; // 장르 선택 시 호출될 함수
}

// 장르 목록을 정의합니다. 각 장르의 이름과 아이콘 컴포넌트를 포함합니다.
const genres = [
  { name: "Fantasy", icon: BookOpen },
  { name: "Sci-Fi", icon: Rocket },
  { name: "Mystery", icon: Search },
];

// GenreSelection 컴포넌트 정의
export function GenreSelection({ onSelectGenre }: GenreSelectionProps) {
  // 선택된 장르를 저장하는 상태입니다.
  const [selected, setSelected] = useState<string | null>(null);

  // 장르 버튼 클릭 시 호출될 핸들러 함수입니다.
  const handleGenreClick = (genreName: string) => {
    setSelected(genreName); // 선택된 장르를 업데이트합니다.
  };

  // '게임 시작' 버튼 클릭 시 호출될 핸들러 함수입니다.
  const handleStartGame = () => {
    if (selected) {
      onSelectGenre(selected); // 선택된 장르로 게임 시작 함수를 호출합니다.
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-4">
      <h2 className="text-3xl font-bold text-gray-100 mb-8 text-center">
        장르를 선택해주세요
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-2xl">
        {genres.map((genre) => (
          // 각 장르에 대한 버튼을 렌더링합니다.
          <button
            key={genre.name}
            onClick={() => handleGenreClick(genre.name)} // 버튼 클릭 시 장르 선택
            className={`
              flex flex-col items-center p-6 rounded-lg shadow-lg
              transition duration-300 ease-in-out transform
              ${
                selected === genre.name // 선택된 장르에 따라 스타일 변경
                  ? "bg-purple-600 border-2 border-purple-400 scale-105" // 선택 시 보라색 배경, 테두리, 확대
                  : "bg-purple-700 hover:bg-purple-800 border border-purple-900 hover:scale-105" // 기본 및 호버 스타일 (통일된 색상)
              }
              text-white font-semibold text-lg
            `}
          >
            {/* 장르 아이콘 */}
            <genre.icon className="h-12 w-12 mb-3 text-purple-200" />
            {/* 장르 이름 */}
            {genre.name}
          </button>
        ))}
      </div>
      {/* '게임 시작' 버튼 */}
      <button
        onClick={handleStartGame}
        disabled={!selected} // 장르가 선택되지 않으면 버튼 비활성화
        className={`
          mt-12 w-full max-w-sm py-4 rounded-lg shadow-xl
          transition duration-300 ease-in-out transform
          ${
            selected
              ? "bg-blue-600 hover:bg-blue-700 active:bg-blue-800 scale-105" // 활성화 시 파란색 버튼 스타일
              : "bg-gray-600 cursor-not-allowed opacity-50" // 비활성화 시 회색 버튼 스타일
          }
          text-white font-bold text-xl
        `}
      >
        게임 시작
      </button>
    </div>
  );
}
