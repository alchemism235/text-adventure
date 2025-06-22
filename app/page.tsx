// app/page.tsx
"use client";

import { useState, useCallback, useEffect } from "react";
import { Menu } from "lucide-react";
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { GameSidebar } from "@/components/game-sidebar";
import { GenreSelection } from "@/components/genre-selection";
import { GameContent } from "@/components/game-content";

// --- 초기 게임 상태 정의 ---
const initialStory =
  "AI 텍스트 어드벤처에 오신 것을 환영합니다! 장르를 선택하고 게임을 시작하세요.";
const initialChoices = ["모험을 시작한다"];
const DEFAULT_MAX_TURNS = 7;
const DEFAULT_FONT_SIZE = 16; // 기본 폰트 크기 (px)
const DEFAULT_FONT_FAMILY = "Inter, sans-serif"; // 기본 폰트
const DEFAULT_LIGHT_MODE = false; // 기본 다크 모드

// 🚨🚨🚨 사용자님이 제공해주신 판타지 초기 스토리 및 선택지 데이터 🚨🚨🚨
const FIXED_FANTASY_INTRO = {
  content: `에리스 벨라노아는 그늘진 숲을 지나가며 숨을 꼭 참았다. 가지 아래로 비치는 달빛은 그녀의 표정을 조명하며, 그녀의 은빛 눈동자는 고요한 밤을 비추며 빛났다. 흑발은 잔잔한 서풍에 흩날리며, 그녀의 두 눈은 확고한 일념으로 앞을 바라보았다. 그녀는 대륙 북부의 마법귀족 벨라노아 가문의 후예이며, 현재는 신분을 숨기고 떠도는 마도사였다. 

"에레디아, 제7마력기..." 에리스는 어릴 때부터 수많은 이야기를 들었다. '마력붕괴'라는 이름으로 대륙을 동요시킨 그 끔찍한 사건은, 고대의 금지된 마법이 오용되어 대륙 절반이 황무지가 된 것이었다. 그리고 그 후 사람들은 폐허를 복구하며 질서를 되찾아 나간다. 마법에 대한 공포와 동경이 공존하는 세상, 고대 유적을 탐사하거나 잊힌 마법서를 찾는 이들이 늘어가는 세상.

에리스는 손가락에 걸린 낡은 마법 가문의 인장 반지를 바라보았다. 반지는 고대마법의 흔적을 지니고 있었고, 그 무게는 그녀가 봉인해야 하는 책임을 상기시켰다. 그녀는 신비한 문양이 그려진 오래된 지도를 꺼냈다. 이것은 '파멸의 기록'을 찾아가는 지침서였다. 그녀의 가문에는 고대 금지된 마법을 봉인해오던 역사가 있었고, 그녀의 몸에는 그 흔적이 깊이 새겨져 있었다.

"이 지도가 나를 안내할 것이다." 그녀는 혼자 중얼거렸다. 그녀는 마법을 사용하면 몸에 고통이 따르는 저주에 시달리고 있었다. 다만 그 고통이 그녀를 힘들게 만들지 않았다. 그 고통은 그녀에게 단순히 '고통'이 아니라, '책임의 무게'이자 '현실을 직시하는 용기'이기도 했다.

그녀는 금지된 마법이 깨어나고 있음을 느꼈다. 세계의 균형이 무너질 위기에 처한 이 세상이 그녀에게 필요로 하는거다. 에리스는 마력을 감지하며 숲을 빠져나왔다. 그녀의 눈에 반짝이는 불빛이 보였다. 고대 유적이 펼쳐진 폐허 앞에 선 에리스는 호기심과 정의감으로 가득 차 있었다. 그녀는 숲을 나와 바람을 느끼며 속삭였다.

"내가 여기 있는 이유는, 세상을 구하기 위해서다. 벨라노아 가문의 봉인자로서, 그리고 마법을 구해낼 마도사로서..." 

그녀는 한숨을 내쉬며 앞으로 나아갔다. 에리스 벨라노아의 험난한 여정이 이제 시작되었다.`,
  choices: [
    "유적 안으로 곧장 들어가 조사를 시작한다.",
    "근처에 숨을 곳을 찾아 밤을 보내며 마력의 흐름을 관측한다.",
  ],
};

// 🚨🚨🚨 사용자님이 제공해주신 Sci-Fi 초기 스토리 및 선택지 데이터 🚨🚨🚨
const FIXED_SCI_FI_INTRO = {
  content: `서기 2190년, 도시 네오크레아. 감정은 위험 요소로 분류되고, 시민의 일상은 AI 총합체 에이드라(AIDRA)에 의해 완벽하게 조율된다.

유전정보센터에서 근무 중이던 루시아는 오늘도 일상적인 감정 로그를 검토하고 있었다.  
그러다 한 시민의 기록에서 이상 감정 반응 로그를 발견한다. 분명히 슬픔 수치가 기준치를 초과했지만, AI 감시 시스템이 아무런 조치를 취하지 않았다.

그 순간, 루시아의 머릿속으로 경고창이 뜬다.

"Emotion Threshold Exceeded: No Warning Issued."

그녀는 손끝이 떨리는 걸 느낀다. 방금 전, 자신도 감정을 느꼈다. 분명히 감정이 격해졌지만, **자신에게도 아무런 경고가 오지 않았다.**

"…왜 나도 감지되지 않은 거지?"

두려움이 가슴을 파고든다. 어쩌면, 자신은 시스템의 밖에 있는 존재일지도 모른다는 생각. 그리고, 그 감정 로그를 남기고 사라진 시민… 그는 누구였을까?

루시아는 망설인다. 감정은 위험한 것이다. 하지만 이대로 넘어가면, 영영 진실에 다다를 수 없을지도 모른다.`,
  choices: [
    "기록된 시민 ID의 흔적을 추적해본다.",
    "불안한 마음을 숨기고 일상으로 돌아간다.",
  ],
};

// 🚨🚨🚨 사용자님이 제공해주신 Mystery 초기 스토리 및 선택지 데이터 🚨🚨🚨
const FIXED_MYSTERY_INTRO = {
  content: `1987년 가을, 을지로의 한 라디오 방송국.  
한서린은 늦은 밤까지 음향 편집실에 홀로 남아 있었다.  
의뢰받은 라디오 드라마 녹음을 정리하던 중,  
녹음되지 말아야 할 한 구간이 테이프 속에서 튀어나왔다.

—— “S-02 실험체 반응 이상 없음… 대상은 감정 파장에 민감한 상태로 유지 중…”

낯선 남자의 목소리.  
그 순간, 서린의 머릿속에 강렬한 두통과 함께 불안한 감정이 밀려들었다.  
익숙하면서도 낯선 그 감정… 그리고 'S-02'라는 이름.

그녀는 의자에서 몸을 일으키며, 멈춰 선 테이프를 바라보았다.  
진실을 들을 준비가 되어 있는 걸까? 아니면 그냥 일상으로 돌아가야 할까?`,

  choices: [
    "테이프를 다시 재생해본다. 그 목소리에 더 집중해본다.",
    "테이프를 꺼버리고 집으로 돌아간다. 이건 단지 편집 오류일 뿐이다.",
  ],
};

// 게임 저장 데이터 타입
interface GameSaveData {
  saveId: string;
  name: string;
  timestamp: string;
  genre: string;
  story: string;
  choices: string[];
  currentTurn: number;
  gameContext: string; // JSON 문자열로 저장됨
  isGameEnded: boolean;
  totalStorySummary: string; // 저장 데이터에 스토리 요약 추가
}

// 로컬 스토리지 키 접두사
const LOCAL_STORAGE_PREFIX = "ai_text_adventure_save_";
const SETTINGS_STORAGE_KEY = "ai_text_adventure_settings";

export default function TextAdventure() {
  const [gameStarted, setGameStarted] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [currentStory, setCurrentStory] = useState(initialStory);
  const [choices, setChoices] = useState<string[]>(initialChoices);
  const [gameContext, setGameContext] = useState<any[]>([]);
  const [currentTurn, setCurrentTurn] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isGameEnded, setIsGameEnded] = useState(false);

  // 모달 관련 상태
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showLoadModal, setShowLoadModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [saveGameName, setSaveGameName] = useState("");
  const [savedGamesList, setSavedGamesList] = useState<GameSaveData[]>([]);

  // 새로운 설정 관련 상태
  const [maxTurnsLimit, setMaxTurnsLimit] = useState(DEFAULT_MAX_TURNS);
  const [fontSize, setFontSize] = useState(DEFAULT_FONT_SIZE);
  const [fontFamily, setFontFamily] = useState(DEFAULT_FONT_FAMILY);
  const [isLightMode, setIsLightMode] = useState(DEFAULT_LIGHT_MODE);

  // 주관식 입력 상태
  const [customChoiceInput, setCustomChoiceInput] = useState("");

  // 스토리 요약 상태 추가
  const [totalStorySummary, setTotalStorySummary] = useState<string>("");

  // 설정 값 로컬 스토리지에서 로드 및 저장
  useEffect(() => {
    // 설정 불러오기
    try {
      const savedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        setMaxTurnsLimit(parsedSettings.maxTurnsLimit ?? DEFAULT_MAX_TURNS);
        setFontSize(parsedSettings.fontSize ?? DEFAULT_FONT_SIZE);
        setFontFamily(parsedSettings.fontFamily ?? DEFAULT_FONT_FAMILY);
        setIsLightMode(parsedSettings.isLightMode ?? DEFAULT_LIGHT_MODE);
      }
    } catch (error) {
      console.error("Failed to load settings from local storage:", error);
    }
  }, []);

  useEffect(() => {
    // 설정 변경 시 로컬 스토리지에 저장
    try {
      const settingsToSave = {
        maxTurnsLimit,
        fontSize,
        fontFamily,
        isLightMode,
      };
      localStorage.setItem(
        SETTINGS_STORAGE_KEY,
        JSON.stringify(settingsToSave)
      );
    } catch (error) {
      console.error("Failed to save settings to local storage:", error);
    }
  }, [maxTurnsLimit, fontSize, fontFamily, isLightMode]);

  /**
   * API 호출 함수: 게임 스토리 및 선택지를 GPT로부터 가져옵니다.
   */
  const fetchStory = useCallback(
    async (action: "start" | "continue", userChoice?: string) => {
      setIsLoading(true);
      setIsGameEnded(false);

      try {
        let prompt = "";
        let mode: "text" | "json" = "json";

        if (action === "start") {
          prompt = `텍스트 어드벤처 게임을 시작합니다. 장르는 "${selectedGenre}"입니다. 첫 번째 시나리오를 제시하고 두 가지의 선택지를 JSON 형식으로 제공해주세요. JSON 형식은 항상 {"content": "스토리 내용", "choices": ["선택지1", "선택지2"], "lastStorySummary": "이전 스토리 요약"} 입니다. "lastStorySummary"는 현재 생성하는 스토리의 요약을 3~4문장으로 작성합니다. 스토리는 선택된 장르의 분위기(예: 어두운 판타지, 첨단 SF, 미스터리 수사)에 맞춰 생생하게 묘사해주세요.`;
          mode = "json";
          setGameContext([]);
          setCurrentTurn(0);
          setTotalStorySummary(""); // 새 게임 시작 시 요약 초기화
        } else if (action === "continue" && userChoice) {
          const lastStory = currentStory;
          prompt = `이전 스토리: "${lastStory}". 사용자 선택: "${userChoice}". 이 선택에 따라 다음 스토리 시나리오를 제시하고 두 가지의 선택지를 JSON 형식으로 제공해주세요. JSON 형식은 항상 {"content": "스토리 내용", "choices": ["선택지1", "선택지2"], "lastStorySummary": "이전 스토리 요약"} 입니다. "lastStorySummary"는 현재 생성하는 스토리의 요약을 3~4문장으로 작성합니다. 스토리는 선택된 장르의 분위기에 맞춰 생생하게 묘사해주세요. 만약 게임이 종료되어야 한다면, choices 배열을 비워주세요. (예: "choices": [])`;
          mode = "json";
        }

        const response = await fetch("/api/game", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt, mode, genre: selectedGenre }),
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Received data from API:", data);

        let newStory = data.content || "오류: 스토리를 불러올 수 없습니다.";
        let newChoices = data.choices || [];
        const newStorySummary = data.lastStorySummary || ""; // 새로운 스토리 요약 추출

        setGameContext((prevContext) => [
          ...prevContext,
          { role: "user", content: userChoice || "게임 시작" },
          {
            role: "assistant",
            content: newStory,
            choices: newChoices,
            summary: newStorySummary,
          }, // 요약도 컨텍스트에 추가
        ]);

        setCurrentStory(newStory);
        setChoices(newChoices);
        setTotalStorySummary((prevSummary) => {
          return prevSummary
            ? `${prevSummary}\n\n${newStorySummary}`
            : newStorySummary;
        });
        setCurrentTurn((prevTurn) => prevTurn + 1);

        const gameShouldEnd =
          newChoices.length === 0 || currentTurn + 1 >= maxTurnsLimit;
        setIsGameEnded(gameShouldEnd);
      } catch (error) {
        console.error("Failed to fetch story from AI:", error);
        setCurrentStory(
          "AI와의 통신에 문제가 발생했습니다. 네트워크 연결 및 OpenAI API 키를 점검해주세요."
        );
        setChoices(["새 게임 시작"]);
        setIsGameEnded(true);
      } finally {
        setIsLoading(false);
      }
    },
    [selectedGenre, currentStory, currentTurn, maxTurnsLimit]
  );

  const handleGenreSelect = useCallback(
    async (genre: string) => {
      setGameStarted(true);
      setSelectedGenre(genre);
      setIsGameEnded(false);
      setCustomChoiceInput(""); // 장르 선택 시 주관식 입력 초기화
      setTotalStorySummary(""); // 장르 선택 시 총 요약 초기화

      // 🚨🚨🚨 장르별 고정된 초기 스토리 사용 로직 🚨🚨🚨
      let fixedIntroData = null;
      let initialSummary = "";

      if (genre === "Fantasy") {
        fixedIntroData = FIXED_FANTASY_INTRO;
        initialSummary =
          "벨라노아 가문의 에리스가 고대 유적을 찾아 모험을 시작합니다.";
      } else if (genre === "Sci-Fi") {
        fixedIntroData = FIXED_SCI_FI_INTRO;
        initialSummary =
          "감정이 통제되는 도시 네오크레아에서 루시아가 감지되지 않은 감정 반응의 미스터리를 추적합니다.";
      } else if (genre === "Mystery") {
        fixedIntroData = FIXED_MYSTERY_INTRO;
        initialSummary =
          "사설 탐정 한서린이 라디오 테이프에서 발견된 기이한 녹음과 연쇄 실종 사건의 연결고리를 파헤칩니다.";
      }

      if (fixedIntroData) {
        setCurrentStory(fixedIntroData.content);
        setChoices(fixedIntroData.choices);
        setGameContext([
          { role: "user", content: `${genre} 게임 시작` },
          {
            role: "assistant",
            content: fixedIntroData.content,
            choices: fixedIntroData.choices,
            summary: initialSummary,
          },
        ]);
        setTotalStorySummary(initialSummary);
        setCurrentTurn(1);
        setIsLoading(false);
      } else {
        // 다른 장르 선택 시 AI로부터 첫 스토리 생성
        await fetchStory("start");
      }
    },
    [fetchStory]
  );

  const handleChoice = useCallback(
    async (choiceText: string) => {
      if (isLoading || isGameEnded) return;

      if (choiceText.includes("(게임 종료)")) {
        setCurrentStory(
          "여정이 끝났습니다. 당신의 모험은 여기서 마무리됩니다."
        );
        setChoices([]);
        setIsGameEnded(true);
        return;
      }

      if (customChoiceInput.trim() !== "" && choiceText === customChoiceInput) {
        setCustomChoiceInput("");
      }

      await fetchStory("continue", choiceText);
    },
    [isLoading, isGameEnded, fetchStory, customChoiceInput]
  );

  const handleNewGame = useCallback(() => {
    setGameStarted(false);
    setSelectedGenre(null);
    setCurrentStory(initialStory);
    setChoices(initialChoices);
    setGameContext([]);
    setCurrentTurn(0);
    setIsGameEnded(false);
    setIsLoading(false);
    setShowSaveModal(false);
    setShowLoadModal(false);
    setShowSettingsModal(false);
    setCustomChoiceInput("");
    setTotalStorySummary(""); // 새 게임 시작 시 총 요약 초기화
  }, []);

  const handleSaveGame = useCallback(() => {
    if (!selectedGenre || !gameStarted) {
      alert("게임 저장 준비가 되지 않았습니다. 새 게임을 시작해주세요.");
      return;
    }
    if (!saveGameName.trim()) {
      alert("저장할 게임 이름을 입력해주세요.");
      return;
    }

    try {
      const saveId = new Date().toISOString().replace(/[:.-]/g, "_");
      const localStorageKey = `${LOCAL_STORAGE_PREFIX}${saveId}`;

      const gameData: GameSaveData = {
        saveId,
        name: saveGameName.trim(),
        timestamp: new Date().toISOString(),
        genre: selectedGenre,
        story: currentStory,
        choices: choices,
        currentTurn: currentTurn,
        gameContext: JSON.stringify(gameContext),
        isGameEnded: isGameEnded,
        totalStorySummary: totalStorySummary, // 총 요약 저장
      };

      localStorage.setItem(localStorageKey, JSON.stringify(gameData));
      console.log("게임 저장 성공 (로컬 스토리지):", gameData);
      setSaveGameName("");
      setShowSaveModal(false);
      alert("게임이 성공적으로 저장되었습니다!");
    } catch (error) {
      console.error("게임 저장 실패 (로컬 스토리지):", error);
      alert("게임 저장에 실패했습니다. 브라우저 콘솔을 확인해주세요.");
    }
  }, [
    selectedGenre,
    gameStarted,
    saveGameName,
    currentStory,
    choices,
    currentTurn,
    gameContext,
    isGameEnded,
    totalStorySummary,
  ]);

  const fetchSavedGames = useCallback(() => {
    const loadedGames: GameSaveData[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(LOCAL_STORAGE_PREFIX)) {
        try {
          const item = localStorage.getItem(key);
          if (item) {
            const gameData: GameSaveData = JSON.parse(item);
            loadedGames.push(gameData);
          }
        } catch (error) {
          console.error(`Failed to parse saved game from key ${key}:`, error);
        }
      }
    }
    loadedGames.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    setSavedGamesList(loadedGames);
    console.log("저장된 게임 목록 불러오기 성공 (로컬 스토리지):", loadedGames);
  }, []);

  const handleLoadGame = useCallback((gameToLoad: GameSaveData) => {
    try {
      const parsedGameContext = JSON.parse(gameToLoad.gameContext);

      setGameStarted(true);
      setSelectedGenre(gameToLoad.genre);
      setCurrentStory(gameToLoad.story);
      setChoices(gameToLoad.choices);
      setCurrentTurn(gameToLoad.currentTurn);
      setGameContext(parsedGameContext);
      setIsGameEnded(gameToLoad.isGameEnded);
      setTotalStorySummary(gameToLoad.totalStorySummary || ""); // 총 요약 불러오기
      setShowLoadModal(false);
      alert("게임이 성공적으로 불러와졌습니다!");
    } catch (error) {
      console.error("게임 불러오기 실패 (로컬 스토리지):", error);
      alert("게임 불러오기에 실패했습니다. 브라우저 콘솔을 확인해주세요.");
    }
  }, []);

  const openSaveModal = useCallback(() => setShowSaveModal(true), []);
  const closeSaveModal = useCallback(() => {
    setSaveGameName("");
    setShowSaveModal(false);
  }, []);
  const openLoadModal = useCallback(() => {
    fetchSavedGames();
    setShowLoadModal(true);
  }, [fetchSavedGames]);
  const closeLoadModal = useCallback(() => setShowLoadModal(false), []);
  const openSettingsModal = useCallback(() => setShowSettingsModal(true), []);
  const closeSettingsModal = useCallback(() => setShowSettingsModal(false), []);

  const appClassName = `min-h-screen flex flex-col ${
    isLightMode ? "bg-gray-100 text-gray-900" : "bg-gray-900 text-gray-100"
  }`;

  return (
    <SidebarProvider>
      <div className={appClassName}>
        <GameSidebar
          onNewGame={handleNewGame}
          onSaveGame={openSaveModal}
          onLoadGame={openLoadModal}
          onSettings={openSettingsModal}
        />
        <SidebarInset>
          <header
            className={`border-b ${
              isLightMode
                ? "border-gray-300 bg-white text-gray-900"
                : "border-gray-800 bg-gray-900 text-gray-100"
            } p-4 flex items-center`}
          >
            <SidebarTrigger className="mr-4">
              <Menu className="h-6 w-6" />
            </SidebarTrigger>
            <h1
              className={`text-2xl font-bold text-center flex-1 ${
                isLightMode ? "text-purple-700" : "text-purple-300"
              }`}
            >
              무한한 이야기: 당신의 선택
            </h1>
          </header>

          <main
            className="flex-1 p-4 overflow-hidden flex flex-col"
            style={{ fontSize: `${fontSize}px`, fontFamily: fontFamily }}
          >
            {!gameStarted ? (
              <GenreSelection onSelectGenre={handleGenreSelect} />
            ) : (
              <GameContent
                story={currentStory}
                choices={isGameEnded ? [] : choices}
                onChoiceSelected={handleChoice}
                genre={selectedGenre || ""}
                isLoading={isLoading}
                isGameEnded={isGameEnded}
                currentTurn={currentTurn}
                fontSize={fontSize}
                fontFamily={fontFamily}
                customChoiceInput={customChoiceInput}
                onCustomChoiceInputChange={setCustomChoiceInput}
                onCustomChoiceSubmit={() => handleChoice(customChoiceInput)}
                totalStorySummary={totalStorySummary}
              />
            )}
          </main>
        </SidebarInset>
      </div>

      {showSaveModal && (
        <CustomModal
          onClose={closeSaveModal}
          title="게임 저장"
          isLightMode={isLightMode}
        >
          <p className="mb-4">현재 게임을 저장합니다.</p>
          <input
            type="text"
            placeholder="저장할 게임 이름 입력"
            className={`w-full p-2 mb-4 rounded-md border focus:outline-none focus:ring-2 ${
              isLightMode
                ? "bg-gray-200 text-gray-900 border-gray-400 focus:ring-purple-600"
                : "bg-gray-700 text-white border-gray-600 focus:ring-purple-500"
            }`}
            value={saveGameName}
            onChange={(e) => setSaveGameName(e.target.value)}
          />
          <button
            onClick={handleSaveGame}
            className={`w-full font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out ${
              isLightMode
                ? "bg-purple-600 hover:bg-purple-700 text-white"
                : "bg-purple-600 hover:bg-purple-700 text-white"
            }`}
          >
            저장하기
          </button>
          <button
            onClick={closeSaveModal}
            className={`mt-6 w-full font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out ${
              isLightMode
                ? "bg-gray-300 hover:bg-gray-400 text-gray-800"
                : "bg-gray-600 hover:bg-gray-700 text-white"
            }`}
          >
            닫기
          </button>
        </CustomModal>
      )}

      {showLoadModal && (
        <CustomModal
          onClose={closeLoadModal}
          title="게임 불러오기"
          isLightMode={isLightMode}
        >
          <p className="mb-4">저장된 게임 목록:</p>
          {savedGamesList.length === 0 ? (
            <p
              className={`text-center ${
                isLightMode ? "text-gray-600" : "text-gray-400"
              }`}
            >
              저장된 게임이 없습니다.
            </p>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
              {savedGamesList.map((game) => (
                <div
                  key={game.saveId}
                  className={`flex justify-between items-center p-3 rounded-md border ${
                    isLightMode
                      ? "bg-gray-200 border-gray-400"
                      : "bg-gray-700 border-gray-600"
                  }`}
                >
                  <div>
                    <p
                      className={`font-bold text-lg ${
                        isLightMode ? "text-gray-800" : "text-white"
                      }`}
                    >
                      {game.name}
                    </p>
                    <p
                      className={`text-sm ${
                        isLightMode ? "text-gray-600" : "text-gray-400"
                      }`}
                    >
                      장르: {game.genre} | 턴: {game.currentTurn}
                    </p>
                    <p
                      className={`text-xs ${
                        isLightMode ? "text-gray-500" : "text-gray-500"
                      }`}
                    >
                      저장 시간: {new Date(game.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleLoadGame(game)}
                    className={`ml-4 font-bold py-1.5 px-3 rounded-md transition duration-300 ease-in-out ${
                      isLightMode
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
                  >
                    불러오기
                  </button>
                </div>
              ))}
            </div>
          )}
          <button
            onClick={closeLoadModal}
            className={`mt-4 w-full font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out ${
              isLightMode
                ? "bg-gray-300 hover:bg-gray-400 text-gray-800"
                : "bg-gray-600 hover:bg-gray-700 text-white"
            }`}
          >
            닫기
          </button>
        </CustomModal>
      )}

      {showSettingsModal && (
        <CustomModal
          onClose={closeSettingsModal}
          title="설정"
          isLightMode={isLightMode}
        >
          <p
            className={`mb-4 ${
              isLightMode ? "text-gray-700" : "text-gray-300"
            }`}
          >
            여기에 게임 설정 옵션을 추가할 수 있습니다.
          </p>
          <div className="space-y-4">
            {/* 🚨🚨🚨 턴 제한 설정 🚨🚨🚨 */}
            <div>
              <label
                htmlFor="maxTurns"
                className={`block mb-1 ${
                  isLightMode ? "text-gray-700" : "text-gray-300"
                }`}
              >
                최대 턴 수 (현재: {maxTurnsLimit})
              </label>
              <input
                id="maxTurns"
                type="number"
                min="1"
                max="20" // 적절한 최대값 설정 (예: 20턴)
                className={`w-full p-2 rounded-md border focus:outline-none focus:ring-2 ${
                  isLightMode
                    ? "bg-gray-200 text-gray-900 border-gray-400 focus:ring-purple-600"
                    : "bg-gray-700 text-white border-gray-600 focus:ring-purple-500"
                }`}
                value={maxTurnsLimit}
                onChange={(e) => setMaxTurnsLimit(Number(e.target.value))}
              />
              <p
                className={`text-sm mt-1 ${
                  isLightMode ? "text-gray-500" : "text-gray-400"
                }`}
              >
                게임이 자동으로 종료되기까지의 최대 턴 수입니다.
              </p>
            </div>

            {/* 🚨🚨🚨 폰트 크기 설정 🚨🚨🚨 */}
            <div>
              <label
                htmlFor="fontSize"
                className={`block mb-1 ${
                  isLightMode ? "text-gray-700" : "text-gray-300"
                }`}
              >
                폰트 크기 (현재: {fontSize}px)
              </label>
              <input
                id="fontSize"
                type="range" // 슬라이더 사용
                min="12"
                max="24"
                step="1"
                className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${
                  isLightMode ? "bg-gray-300" : "bg-gray-600"
                } dark:bg-gray-700`}
                style={{ accentColor: isLightMode ? "#8B5CF6" : "#A78BFA" }} // 슬라이더 색상
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
              />
              <p
                className={`text-sm mt-1 ${
                  isLightMode ? "text-gray-500" : "text-gray-400"
                }`}
              >
                게임 텍스트의 크기를 조절합니다.
              </p>
            </div>

            {/* 🚨🚨🚨 폰트 변경 설정 🚨🚨🚨 */}
            <div>
              <label
                htmlFor="fontFamily"
                className={`block mb-1 ${
                  isLightMode ? "text-gray-700" : "text-gray-300"
                }`}
              >
                폰트 변경
              </label>
              <select
                id="fontFamily"
                className={`w-full p-2 rounded-md border focus:outline-none focus:ring-2 ${
                  isLightMode
                    ? "bg-gray-200 text-gray-900 border-gray-400 focus:ring-purple-600"
                    : "bg-gray-700 text-white border-gray-600 focus:ring-purple-500"
                }`}
                value={fontFamily}
                onChange={(e) => setFontFamily(e.target.value)}
              >
                <option value="Inter, sans-serif">Inter (기본)</option>
                <option value="serif">Serif (고전)</option>
                <option value="monospace">Monospace (코딩)</option>
                <option value="system-ui, sans-serif">System UI</option>
                {/* 다른 폰트 옵션을 추가할 수 있습니다. */}
              </select>
              <p
                className={`text-sm mt-1 ${
                  isLightMode ? "text-gray-500" : "text-gray-400"
                }`}
              >
                게임 텍스트의 폰트 스타일을 변경합니다.
              </p>
            </div>

            {/* 🚨🚨🚨 라이트/다크 모드 토글 🚨🚨🚨 */}
            <div className="flex items-center justify-between">
              <label
                htmlFor="lightModeToggle"
                className={`block ${
                  isLightMode ? "text-gray-700" : "text-gray-300"
                }`}
              >
                라이트 모드
              </label>
              <label
                htmlFor="lightModeToggle"
                className="relative inline-flex items-center cursor-pointer"
              >
                <input
                  type="checkbox"
                  id="lightModeToggle"
                  className="sr-only peer"
                  checked={isLightMode}
                  onChange={(e) => setIsLightMode(e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
                <span
                  className={`ml-3 text-sm font-medium ${
                    isLightMode ? "text-gray-700" : "text-gray-300"
                  }`}
                >
                  {isLightMode ? "켜짐" : "꺼짐"}
                </span>
              </label>
            </div>
          </div>
          <button
            onClick={closeSettingsModal}
            className={`mt-6 w-full font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out ${
              isLightMode
                ? "bg-gray-300 hover:bg-gray-400 text-gray-800"
                : "bg-gray-600 hover:bg-gray-700 text-white"
            }`}
          >
            닫기
          </button>
        </CustomModal>
      )}
    </SidebarProvider>
  );
}

interface CustomModalProps {
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  isLightMode: boolean; // 모달 내부에 라이트 모드 적용을 위한 prop
}

const CustomModal: React.FC<CustomModalProps> = ({
  onClose,
  title,
  children,
  isLightMode,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div
        className={`p-6 rounded-lg shadow-xl max-w-sm w-full mx-4 border ${
          isLightMode
            ? "bg-white border-gray-300 text-gray-900"
            : "bg-gray-800 border-gray-700 text-gray-100"
        }`}
      >
        <h2
          className={`text-2xl font-bold mb-4 border-b pb-2 ${
            isLightMode
              ? "border-gray-300 text-gray-800"
              : "border-gray-700 text-white"
          }`}
        >
          {title}
        </h2>
        {children}
      </div>
    </div>
  );
};
