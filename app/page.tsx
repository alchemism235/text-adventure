// app/page.tsx
"use client";

import { useState, useCallback } from "react";
import { Menu } from "lucide-react";
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { GameSidebar } from "@/components/game-sidebar";
import { GenreSelection } from "@/components/genre-selection";
import { GameContent } from "@/components/game-content";

// --- 임시 데이터 (AI 연동 전까지 사용) ---
const initialStory =
  "AI 텍스트 어드벤처에 오신 것을 환영합니다! 장르를 선택하고 게임을 시작하세요.";
const initialChoices = ["모험을 시작한다", "준비물을 점검한다", "다음에 한다"];

const genreStories: { [key: string]: { story: string; choices: string[] } } = {
  Fantasy: {
    story:
      "깊은 숲 속, 신비로운 안개가 자욱하다. 오래된 유적의 입구가 눈앞에 나타난다.",
    choices: [
      "유적 안으로 들어간다.",
      "숲을 더 탐험한다.",
      "캠프를 설치하고 밤을 보낸다.",
    ],
  },
  "Sci-Fi": {
    story:
      "우주선 '갤럭시아'가 미지의 행성 '제논' 궤도에 진입했다. 행성 표면에서는 이상한 에너지 신호가 감지된다.",
    choices: [
      "행성으로 착륙한다.",
      "궤도에서 더 자세히 스캔한다.",
      "다른 행성으로 이동한다.",
    ],
  },
  Mystery: {
    story:
      "오래된 저택의 삐걱거리는 문을 열고 들어섰다. 촛불이 깜빡이는 응접실에는 낡은 일기장이 놓여 있다.",
    choices: ["일기장을 읽어본다.", "저택을 더 조사한다.", "경찰에 신고한다."],
  },
};

// 턴별 더미 스토리와 선택지 (예시, 실제 게임은 더 복잡하게 구성 가능)
const dummyProgress: { [key: number]: { story: string; choices: string[] } } = {
  1: {
    story: "새로운 모험이 시작되었습니다! 당신은 미지의 길 앞에 서 있습니다.",
    choices: ["왼쪽 길로 간다", "오른쪽 길로 간다", "뒤로 돌아간다"],
  },
  2: {
    story: "험난한 산길에 접어들었다. 저 멀리 거대한 그림자가 보인다...",
    choices: ["그림자를 향해 간다", "숨을 곳을 찾는다"],
  },
  3: {
    story: "그림자는 고대 거인의 형상이었다. 거인이 당신을 향해 손을 뻗는다!",
    choices: ["도망친다", "맞서 싸운다"],
  },
  4: {
    story: "격렬한 전투 끝에 거인은 쓰러졌다. 당신은 지쳐 쓰러진다...",
    choices: ["휴식을 취한다", "주변을 탐색한다"],
  },
  5: {
    story: "휴식 중 이상한 소리가 들린다. 동굴에서 빛이 새어 나온다.",
    choices: ["동굴로 들어간다", "소리의 근원을 찾아본다"],
  },
  6: {
    story: "동굴 속은 보물로 가득했다! 당신은 부자가 되었다.",
    choices: ["(게임 종료)"], // 게임 종료 시 선택지는 1개 또는 없음
  },
};
// --- 임시 데이터 끝 ---

export default function TextAdventure() {
  const [gameStarted, setGameStarted] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [currentStory, setCurrentStory] = useState(initialStory);
  const [choices, setChoices] = useState<string[]>(initialChoices);

  // OpenAI API 연동을 위해 미리 정의된 상태 변수들 (현재는 더미 값으로 사용)
  const [gameContext, setGameContext] = useState<any[]>([]); // API 컨텍스트 (지금은 사용 안 함)
  const [currentTurn, setCurrentTurn] = useState(0); // 현재 게임 턴 수
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 (지금은 항상 false)
  const [isGameEnded, setIsGameEnded] = useState(false); // 게임 종료 여부

  // --- API 호출 함수 (주석 처리 또는 더미 데이터 사용) ---
  const fetchStory = useCallback(
    async (action: "start" | "continue", userChoice?: string) => {
      setIsLoading(true); // 로딩 시작 (잠시 후 false로 바로 변경)

      // TODO: 나중에 API 팀원의 코드를 여기에 붙여넣으세요!
      // 예시: const response = await fetch("/api/game", { ... });
      // 현재는 더미 데이터로 즉시 응답하는 것처럼 처리
      await new Promise((resolve) => setTimeout(resolve, 500)); // 0.5초 딜레이 시뮬레이션

      if (action === "start") {
        const genreData = selectedGenre ? genreStories[selectedGenre] : null;
        if (genreData) {
          setCurrentStory(genreData.story);
          setChoices(genreData.choices);
          setCurrentTurn(1);
          setIsGameEnded(false);
        } else {
          // 장르 선택이 안 된 경우 초기 상태로
          setCurrentStory(initialStory);
          setChoices(initialChoices);
          setCurrentTurn(0);
          setIsGameEnded(false);
        }
      } else if (action === "continue" && userChoice) {
        // 턴 진행에 따른 더미 스토리
        const nextTurn = currentTurn + 1;
        const nextData = dummyProgress[nextTurn];

        if (nextData) {
          setCurrentStory(nextData.story);
          setChoices(nextData.choices);
          setCurrentTurn(nextTurn);
          setIsGameEnded(
            nextData.choices.length === 0 ||
              (nextData.choices.length === 1 &&
                nextData.choices[0] === "(게임 종료)")
          );
        } else {
          // 더 이상 진행할 스토리가 없는 경우 게임 종료
          setCurrentStory(
            "더 이상 진행할 스토리가 없습니다. 게임이 종료됩니다."
          );
          setChoices([]);
          setIsGameEnded(true);
        }
      }

      setIsLoading(false); // 로딩 종료
    },
    [currentTurn, selectedGenre]
  ); // 의존성 배열에 필요한 상태 변수 추가

  /**
   * 장르 선택 핸들러
   */
  const handleGenreSelect = useCallback(async (genre: string) => {
    setSelectedGenre(genre);
    setGameStarted(true);
    setIsGameEnded(false);
    setCurrentTurn(0); // 턴 초기화
    setGameContext([]); // API 컨텍스트 초기화 (나중에 사용)

    // 더미 데이터를 사용하여 스토리 시작
    const genreData = genreStories[genre];
    if (genreData) {
      setCurrentStory(genreData.story);
      setChoices(genreData.choices);
      setCurrentTurn(1); // 1턴부터 시작
    } else {
      setCurrentStory(
        "선택한 장르의 스토리가 준비되지 않았습니다. 다른 장르를 선택해 주세요."
      );
      setChoices([]);
      setIsGameEnded(true);
    }
    setIsLoading(false); // 로딩은 없으므로 바로 false
  }, []);

  /**
   * 선택지 클릭 핸들러
   */
  const handleChoice = useCallback(
    async (choiceText: string) => {
      // 로딩 중이거나 게임이 이미 종료되었다면 중복 클릭 방지
      if (isLoading || isGameEnded) return;

      // TODO: 나중에 API 호출 로직을 여기에 넣으세요.
      // fetchStory("continue", choiceText);
      // 현재는 더미 데이터로 턴 진행
      const nextTurn = currentTurn + 1;
      const nextData = dummyProgress[nextTurn];

      if (nextData) {
        setCurrentStory(nextData.story);
        setChoices(nextData.choices);
        setCurrentTurn(nextTurn);
        setIsGameEnded(
          nextData.choices.length === 0 ||
            (nextData.choices.length === 1 &&
              nextData.choices[0] === "(게임 종료)")
        );
      } else {
        setCurrentStory("더 이상 진행할 스토리가 없습니다. 게임이 종료됩니다.");
        setChoices([]);
        setIsGameEnded(true);
      }
    },
    [currentTurn, isLoading, isGameEnded]
  );

  /**
   * 새로운 게임 시작 핸들러 (사이드바에서 '새 게임' 클릭 시 호출)
   */
  const handleNewGame = useCallback(() => {
    setGameStarted(false);
    setSelectedGenre(null);
    setCurrentStory(initialStory);
    setChoices(initialChoices);
    setGameContext([]); // 컨텍스트 초기화
    setCurrentTurn(0); // 턴 초기화
    setIsGameEnded(false);
    setIsLoading(false); // 로딩 초기화
  }, []);

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
        {/* GameSidebar는 항상 표시되며, '새 게임' 버튼이 작동합니다. */}
        <GameSidebar onNewGame={handleNewGame} />
        <SidebarInset>
          <header className="border-b border-gray-800 p-4 flex items-center">
            {/* SidebarTrigger는 햄버거 메뉴 아이콘입니다. */}
            <SidebarTrigger className="mr-4">
              <Menu className="h-6 w-6" />
            </SidebarTrigger>
            <h1 className="text-2xl font-bold text-center flex-1 text-purple-300">
              Text Adventure Game
            </h1>
          </header>

          <main className="flex-1 p-4 overflow-hidden flex flex-col">
            {!gameStarted ? (
              <GenreSelection onSelectGenre={handleGenreSelect} />
            ) : (
              <GameContent
                story={currentStory}
                choices={choices}
                onChoiceSelected={handleChoice}
                genre={selectedGenre || ""}
                isLoading={isLoading} // 현재는 항상 false로 전달되어 스피너가 안 보임
                isGameEnded={isGameEnded}
                currentTurn={currentTurn}
              />
            )}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
