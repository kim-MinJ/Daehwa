import { useState, useEffect, useRef } from "react";
import { X, Send, User, Bot } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import "./ChatBot.css";
import { useFeeling } from "@/context/FeelingContext";
import { FEELING_ICONS } from "./FeelingIcons";
import axios from "axios";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  type?: "text" | "options" | "feelings"; // 메시지 종류
}

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showIcon, setShowIcon] = useState(true);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "안녕하세요! 무빈이에요 😊 영화에 대해 얘기 나눠보아요!",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const { setSelectedFeeling, setTriggerModal } = useFeeling();

  // 아이콘/텍스트 번갈아 표시
  useEffect(() => {
    const interval = setInterval(() => setShowIcon((prev) => !prev), 2500);
    return () => clearInterval(interval);
  }, []);

  // 스크롤 맨 아래로
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // ✅ 로그인 유저 대화 이력 불러오기
  useEffect(() => {
    if (token && userId) {
      axios
        .get(`http://localhost:8080/api/chat/history/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          const history = res.data.map((m: any, idx: number) => ({
            id: "h-" + idx,
            text: m.content,
            isUser: m.role === "user",
            timestamp: new Date(m.createdAt),
          }));
          setMessages((prev) => [...prev, ...history]);
        })
        .catch(() => console.warn("이전 대화 불러오기 실패"));
    }
  }, [isOpen]);

  // ✅ 메시지 전송
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userInput = inputMessage;
    const newUserMessage: Message = {
      id: Date.now().toString(),
      text: userInput,
      isUser: true,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newUserMessage]);
    setInputMessage("");

    // 추천 키워드 감지
    if (userInput.includes("추천")) {
      setMessages((prev) => [
        ...prev,
        {
          id: "opt-1",
          text: "추천 방식을 선택해주세요 👇",
          isUser: false,
          timestamp: new Date(),
          type: "options",
        },
      ]);
      return;
    }

    // 감정 키워드 딕셔너리
    const feelingKeywords: Record<string, string> = {
      "우울": "슬픔",
      "슬퍼": "슬픔",
      "기뻐": "기쁨",
      "즐거워": "즐거움",
      "신나": "흥분됨",
      "짜릿": "짜릿함",
      "설레": "설렘",
      "화나": "화남",
      "심심": "심심함",
      "놀랐": "놀람",
      "피곤": "피곤함",
    };

    Object.keys(feelingKeywords).forEach((key) => {
      if (userInput.includes(key)) {
        setSelectedFeeling(feelingKeywords[key]);
      }
    });

    // 일반 대화 → 백엔드
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8080/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({
          userId: userId,
          messages: [{ role: "user", content: userInput }],
        }),
      });

      if (!response.ok) throw new Error("챗봇 응답 실패");

      const data = await response.json();
      const botReply =
        data?.choices?.[0]?.message?.content ||
        "죄송해요, 답변을 가져올 수 없어요.";

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          text: botReply,
          isUser: false,
          timestamp: new Date(),
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 2).toString(),
          text: "서버와 연결할 수 없어요. 잠시 후 다시 시도해주세요.",
          isUser: false,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // 옵션 클릭 처리
  const handleOptionClick = (type: "감정" | "장르") => {
    if (type === "감정") {
      setMessages((prev) => [
        ...prev,
        {
          id: "feelings-btns",
          text: "감정을 선택해주세요 👇",
          isUser: false,
          timestamp: new Date(),
          type: "feelings",
        },
      ]);
    } else {
      // 장르 기반 추천 로직 추가 가능
    }
  };

  // 감정 버튼 클릭 → 모달 열기
  const handleFeelingClick = (feeling: string) => {
    setSelectedFeeling(feeling);
    setTriggerModal(true);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSendMessage();
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="w-20 h-20 rounded-full bg-red-600 hover:bg-red-700 shadow-lg animate-pulse"
        >
          {showIcon ? <Bot className="big-icon text-white" /> : <span className="big-text text-white font-bold">무빈</span>}
        </Button>
      )}

      {isOpen && (
        <div className="bg-white rounded-2xl shadow-2xl w-96 h-[900px] flex flex-col border border-gray-200">
          {/* 헤더 */}
          <div className="bg-red-600 text-white p-4 rounded-t-2xl flex justify-between items-center">
            <h3 className="font-semibold">MovieSSG 무빈</h3>
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} className="text-white">
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* 메시지 영역 */}
          <ScrollArea className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl ${
                      message.isUser ? "bg-red-600 text-white" : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>

                    {/* 옵션 버튼 */}
                    {message.type === "options" && (
                      <div className="flex gap-2 mt-2">
                        <Button size="sm" onClick={() => handleOptionClick("감정")}>감정 기반</Button>
                        <Button size="sm" onClick={() => handleOptionClick("장르")}>장르 기반</Button>
                      </div>
                    )}

                    {/* 감정 버튼 */}
                    {message.type === "feelings" && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {Object.entries(FEELING_ICONS).map(([feeling, icon]) => (
                          <Button
                            key={feeling}
                            size="sm"
                            className="bg-gray-200"
                            onClick={() => handleFeelingClick(feeling)}
                          >
                            {icon} {feeling}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* 입력 영역 */}
          <div className="p-4 border-t border-gray-200 flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="메시지를 입력하세요..."
              className="flex-1"
            />
            <Button onClick={handleSendMessage} disabled={!inputMessage.trim() || loading} size="sm" className="bg-red-600">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;