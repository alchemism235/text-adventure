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

  // 🚨🚨🚨 새로운 설정 관련 상태 🚨🚨🚨
  const [maxTurnsLimit, setMaxTurnsLimit] = useState(DEFAULT_MAX_TURNS);
  const [fontSize, setFontSize] = useState(DEFAULT_FONT_SIZE);
  const [fontFamily, setFontFamily] = useState(DEFAULT_FONT_FAMILY);
  const [isLightMode, setIsLightMode] = useState(DEFAULT_LIGHT_MODE);

  // 🚨🚨🚨 주관식 입력 상태 🚨🚨🚨
  const [customChoiceInput, setCustomChoiceInput] = useState("");

  // 🚨🚨🚨 스토리 요약 상태 추가 🚨🚨🚨
  const [totalStorySummary, setTotalStorySummary] = useState<string>("");

  // 🚨🚨🚨 설정 값 로컬 스토리지에서 로드 및 저장 🚨🚨🚨
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
  }, []); // 컴포넌트 마운트 시 한 번만 실행

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
          // 🚨🚨🚨 시작 프롬프트 수정: 요약 요청 추가 및 선택지 2개로 제한 🚨🚨🚨
          prompt = `텍스트 어드벤처 게임을 시작합니다. 장르는 "${selectedGenre}"입니다. 첫 번째 시나리오를 제시하고 두 가지의 선택지를 JSON 형식으로 제공해주세요. JSON 형식은 항상 {"content": "스토리 내용", "choices": ["선택지1", "선택지2"], "lastStorySummary": "이전 스토리 요약"} 입니다. "lastStorySummary"는 현재 생성하는 스토리의 요약을 3~4문장으로 작성합니다. 스토리는 선택된 장르의 분위기(예: 어두운 판타지, 첨단 SF, 미스터리 수사)에 맞춰 생생하게 묘사해주세요.`;
          mode = "json";
          setGameContext([]);
          setCurrentTurn(0);
          setTotalStorySummary(""); // 새 게임 시작 시 요약 초기화
        } else if (action === "continue" && userChoice) {
          const lastStory = currentStory;
          // 🚨🚨🚨 계속 진행 시 프롬프트 수정: 요약 요청 추가 및 선택지 2개로 제한 🚨🚨🚨
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
          // 기존 요약이 있고 새 요약이 있다면 줄바꿈으로 연결
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
      await fetchStory("start");
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
              AI 텍스트 어드벤처 게임
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
                totalStorySummary={totalStorySummary} // 🚨🚨🚨 스토리 요약 전달 🚨🚨🚨
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
