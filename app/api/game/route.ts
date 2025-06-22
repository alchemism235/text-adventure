// app/api/game/route.ts
// AI SDK의 텍스트 생성 함수를 임포트합니다.
import { generateText } from "ai";
// OpenAI 클라이언트 '인스턴스'를 직접 임포트합니다.
import { openai } from "@ai-sdk/openai";
// Next.js의 요청(Request) 및 응답(Response) 객체 타입을 임포트합니다.
import { type NextRequest, NextResponse } from "next/server";

// init_fantasy.json 데이터를 임포트합니다.
// 이 파일은 'text-adventure/app/data/init_fantasy.json' 경로에 있어야 합니다.
import initFantasyData from "@/app/data/init_fantasy.json";

// GPT에게 순수한 소설 본문만 요청하는 함수입니다.
// 현재 게임 흐름에서는 직접 사용되지 않지만, 다른 텍스트 요청 시 활용될 수 있습니다.
async function generateStoryAsText(prompt: string): Promise<string> {
  console.log("🟡 [GPT text요청 프롬프트]", prompt);

  const { text } = await generateText({
    // OpenAI의 GPT-4 Turbo 모델을 사용합니다.
    model: openai.chat("gpt-4-turbo"),
    // temperature는 응답의 창의성/무작위성을 조절합니다 (0.0은 가장 보수적, 1.0은 가장 창의적).
    temperature: 0.9,
    // 시스템 프롬프트: GPT에게 '작가' 역할을 부여하고, 응답 형식에 대한 지시를 합니다.
    system: `당신은 뛰어난 소설 작가입니다. 주어진 설정을 바탕으로 몰입감 있는 어두운 판타지 소설을 써 주세요. 오직 스토리 본문만 생성하고, 추가적인 설명이나 대화체는 일절 포함하지 마세요.`,
    prompt, // 사용자 또는 게임 시스템이 제공하는 실제 프롬프트 내용입니다.
  });

  console.log("🟢 [GPT text응답 결과]", text);
  return text.trim(); // 응답 텍스트의 앞뒤 공백을 제거하여 반환합니다.
}

// GPT에게 스토리 내용, 선택지, 그리고 스토리 요약을 포함한 JSON 객체를 요청하는 함수입니다.
async function generateStoryAsJSON(
  prompt: string
): Promise<{ content: string; choices: string[]; lastStorySummary: string }> {
  console.log("🟡 [GPT json요청 프롬프트]", prompt);
  const { text } = await generateText({
    // OpenAI의 GPT-4 모델을 사용합니다.
    model: openai.chat("gpt-4"),
    temperature: 0.9,
    // 🚨🚨🚨 핵심 시스템 프롬프트: JSON 출력을 강력하게 강제합니다. 🚨🚨🚨
    system: `당신은 텍스트 어드벤처 게임의 마스터입니다. 사용자의 요청에 따라 다음 스토리와 선택지, 그리고 이전 스토리의 요약을 JSON 형식으로 생성해야 합니다. 다른 어떤 설명이나 추가적인 대화체 없이 오직 유효한 JSON 객체만 반환해야 합니다.
    JSON 형식은 반드시 {"content": "스토리 내용", "choices": ["선택지1", "선택지2"], "lastStorySummary": "이전 스토리 요약"} 형태여야 합니다.
    choices 배열에는 항상 두 가지 선택지만 포함해야 합니다.
    "lastStorySummary"는 "content"에 해당하는 이전 스토리의 요약을 3~4문장으로 작성해야 합니다.
    만약 게임이 종료되어야 한다면, choices 배열을 빈 배열([])로 만드세요.`,
    // 🚨🚨🚨 AI SDK의 JSON 응답 형식 지정 옵션: 모델이 JSON을 반환하도록 강제하는 가장 강력한 방법입니다. 🚨🚨🚨
    response_format: { type: "json_object" },
    prompt, // 사용자 또는 게임 시스템이 제공하는 실제 프롬프트 내용입니다.
  } as any); // 🚨🚨🚨 여기 'as any'를 추가하여 TypeScript 오류를 해결합니다. 🚨🚨🚨
  console.log("🟢 [GPT json응답 결과]", text);

  try {
    const cleaned = text
      .replace(/```json/g, "") // GPT가 응답에 포함할 수 있는 '```json' 마크다운을 제거합니다.
      .replace(/```/g, "") // '```' 마크다운을 제거합니다.
      .trim(); // 앞뒤 공백을 제거합니다.

    const parsedJson = JSON.parse(cleaned);

    // GPT가 choices를 2개 이상 주거나, 아예 주지 않는 경우를 대비한 방어 로직
    if (!Array.isArray(parsedJson.choices) || parsedJson.choices.length > 2) {
      console.warn(
        "GPT provided more than 2 choices or invalid choices array. Truncating to 2 choices."
      );
      parsedJson.choices = parsedJson.choices.slice(0, 2); // 첫 2개만 유지
    }

    // lastStorySummary가 없는 경우 빈 문자열로 설정
    parsedJson.lastStorySummary = parsedJson.lastStorySummary || "";

    return parsedJson; // 정리되고 검증된 JSON 객체를 반환합니다.
  } catch (e) {
    // JSON 파싱 오류 발생 시, 디버깅을 위해 원본 응답 텍스트를 함께 로깅합니다.
    console.error("Error parsing JSON from GPT (check raw response):", text);
    console.error("Parsing error details:", e);
    throw new Error("GPT response is not valid JSON"); // 유효하지 않은 JSON일 경우 에러를 발생시킵니다.
  }
}

// Next.js API Routes의 POST 요청을 처리하는 함수입니다.
export async function POST(request: NextRequest) {
  try {
    // 클라이언트로부터 전송된 요청 바디를 JSON 형식으로 파싱합니다.
    const body = await request.json();
    // 요청 바디에서 prompt, mode, genre 값을 추출합니다.
    const { prompt, mode, genre } = body;

    // 🚨🚨🚨 OpenAI API 키가 환경 변수에 설정되었는지 확인합니다. 🚨🚨🚨
    // 키가 없으면 AI 호출을 시도하지 않고 클라이언트에게 에러를 반환합니다.
    if (!process.env.OPENAI_API_KEY) {
      console.error("❌ ERROR: OPENAI_API_KEY is not set in .env.local file.");
      return NextResponse.json(
        {
          content:
            "OpenAI API 키가 설정되지 않았습니다. .env.local 파일을 확인해주세요.",
          choices: ["새 게임 시작"],
          isEnding: true, // 게임을 종료 상태로 간주하여 더 이상 진행되지 않도록 합니다.
        },
        { status: 500 }
      ); // HTTP 500 (Internal Server Error) 상태 코드를 반환합니다.
    }

    // 'mode' 값에 따라 다른 GPT 요청 함수를 호출합니다.
    if (mode === "text") {
      const contentOnly = await generateStoryAsText(prompt);
      return NextResponse.json({ content: contentOnly }); // 텍스트 내용만 JSON으로 반환합니다.
    }

    // 'json' 모드일 때 (주로 게임 스토리 진행에 사용됩니다)
    if (mode === "json") {
      let fullPrompt = prompt; // GPT에게 전달할 최종 프롬프트입니다.
      let initialSettingData: any = null; // 초기 설정 데이터를 저장할 변수입니다.

      // 선택된 장르에 따라 다른 초기 설정 데이터를 로드하고 프롬프트에 추가합니다.
      if (genre === "Fantasy") {
        initialSettingData = initFantasyData; // 판타지 장르의 초기 설정 데이터를 할당합니다.
      }
      // TODO: 다른 장르를 추가하려면 여기에 'else if' 블록을 추가하세요.
      // 예:
      // else if (genre === "Sci-Fi") {
      //     import initSciFiData from "@/app/data/init_sci_fi.json"; // init_sci_fi.json 파일을 만들고 임포트하세요.
      //     initialSettingData = initSciFiData;
      // } else if (genre === "Mystery") {
      //     import initMysteryData from "@/app/data/init_mystery.json"; // init_mystery.json 파일을 만들고 임포트하세요.
      //     initialSettingData = initMysteryData;
      // }

      // 초기 설정 데이터가 있다면 최종 프롬프트에 포함시킵니다.
      if (initialSettingData) {
        // JSON 데이터를 들여쓰기된 문자열로 변환하여 프롬프트에 가독성 있게 삽입합니다.
        const settingString = JSON.stringify(initialSettingData, null, 2);
        fullPrompt = `
                ${prompt}

                --- 게임의 초기 설정 (${genre} 장르): ---
                ${settingString}
                -----------------------------------

                위 설정을 바탕으로 스토리를 이어나가세요.
            `;
      }

      const structured = await generateStoryAsJSON(fullPrompt); // JSON 응답을 요청하는 함수를 호출합니다.
      return NextResponse.json(structured); // GPT로부터 받은 구조화된 JSON 응답을 클라이언트에 반환합니다.
    }

    // 유효하지 않은 'mode' 값이 전송된 경우 에러를 반환합니다.
    return NextResponse.json({ error: "Invalid mode" }, { status: 400 });
  } catch (error) {
    // API 라우트 내부에서 오류 발생 시 콘솔에 자세히 로깅합니다.
    console.error("❌ Error generating story in API route:", error);

    // 클라이언트에게 AI 오류가 발생했음을 알리는 더미 응답을 반환하여,
    // 게임이 완전히 멈추지 않고 사용자에게 피드백을 줄 수 있도록 합니다.
    return NextResponse.json(
      {
        content:
          "AI 스토리를 불러오는 데 문제가 발생했습니다. 네트워크 연결 및 OpenAI API 키를 점검해주세요.",
        choices: ["새로운 시작"], // 에러 시 사용자에게 '새 게임 시작'을 유도하는 선택지를 제공합니다.
        isEnding: true, // 게임을 종료 상태로 간주합니다.
      },
      { status: 500 }
    ); // HTTP 500 (Internal Server Error) 상태 코드를 반환합니다.
  }
}
