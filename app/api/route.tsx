// app/api/game/route.ts
import { NextResponse } from "next/server";
// import OpenAI from 'openai'; // OpenAI 라이브러리는 나중에 활성화합니다.

// const openai = new OpenAI({ // API 키 설정도 나중에 활성화합니다.
//   apiKey: process.env.OPENAI_API_KEY,
// });

// const MAX_TURNS = 7; // 최대 턴 수 (나중에 API 로직에서 사용)

export async function POST(req: Request) {
  // --- 이 블록 안의 모든 코드는 나중에 팀원이 줄 API 연동 코드로 대체될 예정입니다. ---
  // --- 현재는 이 API 라우트가 호출되어도 아무것도 하지 않습니다. ---

  console.log("API /api/game 호출됨 - 현재는 더미 응답");

  // 실제 API 연동이 아닐 때는 요청 바디를 파싱할 필요가 없습니다.
  // const { action, choice, context, currentTurn, genre } = await req.json();

  // console.log("수신된 요청:", { action, choice, context, currentTurn, genre });

  // // TODO: 나중에 이 부분에 팀원이 제공할 OpenAI API 호출 및 응답 처리 로직을 넣으세요.
  // try {
  //   // 유효한 API 키가 없는 경우 미리 경고 (나중에 주석 해제)
  //   // if (!process.env.OPENAI_API_KEY) {
  //   //   return NextResponse.json({ error: "OpenAI API 키가 설정되지 않았습니다." }, { status: 500 });
  //   // }

  //   // let messages = context || []; // 이전 대화 컨텍스트 (나중에 사용)

  //   // if (action === 'start') {
  //   //   messages = [
  //   //     {
  //   //       role: "system",
  //   //       content: `You are a text adventure game master. ... (프롬프트 내용)`,
  //   //     },
  //   //     {
  //   //       role: "user",
  //   //       content: `Start a new text adventure game in the ${genre} genre. ...`,
  //   //     },
  //   //   ];
  //   // } else if (action === 'continue' && choice) {
  //   //   messages.push({
  //   //     role: "user",
  //   //     content: `I choose: ${choice}. What happens next? ...`,
  //   //   });
  //   // }

  //   // const chatCompletion = await openai.chat.completions.create({ ... }); // 실제 API 호출 (나중에 주석 해제)
  //   // const aiResponse = chatCompletion.choices[0].message.content; // 응답 파싱 (나중에 주석 해제)

  //   // messages.push({ role: "assistant", content: aiResponse }); // 컨텍스트 업데이트 (나중에 주석 해제)
  //   // const newTurn = currentTurn + 1; // 턴 증가 (나중에 주석 해제)

  //   // let isEnding = false; // 게임 종료 로직 (나중에 주석 해제)
  //   // if (aiResponse?.includes("The End.") || newTurn >= MAX_TURNS || !aiResponse?.match(/\d+\.\s*(.*)(?:\n|$)/g)) {
  //   //   isEnding = true;
  //   // }

  //   // return NextResponse.json({
  //   //   story: aiResponse,
  //   //   context: messages,
  //   //   currentTurn: newTurn,
  //   //   isEnding: isEnding,
  //   // }, { status: 200 });

  // } catch (error: any) {
  //   console.error("OpenAI API 호출 중 오류 (현재는 주석 처리됨):", error.message || error);
  //   return NextResponse.json({ error: "현재 API 서버는 더미 응답만 보냅니다. (실제 오류 아님)" }, { status: 200 });
  // }

  // 현재는 클라이언트가 직접 더미 데이터를 사용하므로, 이 API 라우트는 사실상 호출되지 않습니다.
  // 만약 클라이언트에서 API를 호출하더라도, 유의미한 응답을 보내지 않을 것입니다.
  // 이 파일의 존재 목적은 나중에 API를 붙여넣기 위한 "틀"을 마련하는 것입니다.

  return NextResponse.json(
    {
      message: "API 라우트가 준비되었습니다. (현재는 더미 응답)",
      // 클라이언트 page.tsx는 이 응답을 사용하지 않고 자체 더미 데이터를 사용합니다.
      // 하지만 API를 테스트할 때를 위해 기본적인 형태를 유지합니다.
      story:
        "이것은 API 라우트에서 온 더미 스토리입니다. 클라이언트에서는 보이지 않을 수 있습니다.",
      choices: ["더미 선택지 1", "더미 선택지 2"],
      context: [],
      currentTurn: 0,
      isEnding: false,
    },
    { status: 200 }
  );
}
