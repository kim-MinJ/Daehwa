import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, User, Bot } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';


interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showIcon, setShowIcon] = useState(true);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: '안녕하세요! MovieSSG 고객지원 챗봇입니다. 영화 추천, 검색, 문의사항 등 무엇이든 도와드리겠습니다! 😊',
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);

   const userId = localStorage.getItem("userId"); 
  const token = localStorage.getItem("token");
const messagesEndRef = useRef<HTMLDivElement | null>(null);
  
  // 아이콘과 텍스트 번갈아 표시하기
  useEffect(() => {
    const interval = setInterval(() => {
      setShowIcon(prev => !prev);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);


  // ✅ 메시지 전송
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const newUserMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newUserMessage]);
    const userInput = inputMessage;
    setInputMessage('');
    setLoading(true);


    
    try {
      // ✅ 백엔드 호출 (Spring Boot API)
      const response = await fetch('http://localhost:8080/api/chat', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          "Authorization": token ? `Bearer ${token}` : ""
        },
        body: JSON.stringify({
          userId: userId, // 👉 localStorage에서 가져온 실제 로그인 유저 ID
          messages: [{ role: 'user', content: userInput }]
        })
      });

      if (!response.ok) {
        throw new Error('챗봇 응답 실패');
      }

      const data = await response.json();
      // localStorage.setItem("token", data.token);
      // localStorage.setItem("userId", data.userId);  
      // assistant 응답 꺼내기
      const botReply =
        data?.choices?.[0]?.message?.content ||
        '죄송해요, 답변을 가져올 수 없어요.';

      const newBotMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botReply,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, newBotMessage]);
    } catch (error) {
      console.error(error);
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        text: '서버와 연결할 수 없어요. 잠시 후 다시 시도해주세요.',
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* 챗봇 버튼 */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="w-20 h-20 rounded-full bg-red-600 hover:bg-red-700 shadow-lg transition-all duration-300 hover:scale-110 animate-pulse"
        >
          {showIcon ? (
            <Bot className="w-16 h-16 text-white robot-animation" />
          ) : (
            <span className="text-white font-bold text-lg text-center leading-tight">
              챗봇
            </span>
          )}
        </Button>
      )}

      {/* 챗봇 창 */}
      {isOpen && (
        <div className="bg-white rounded-2xl shadow-2xl w-96 h-[975px] flex flex-col border border-gray-200 animate-in slide-in-from-bottom-4 duration-300">
          {/* 헤더 */}
          <div className="bg-red-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                <Bot className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold">MovieSSG Bot</h3>
                <p className="text-red-100 text-sm">
                  {loading ? '답변 작성중...' : '온라인'}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-red-700 h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* 메시지 영역 */}
           <ScrollArea className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-4">
              {messages.map(message => (
                <div
                  key={message.id}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl ${
                      message.isUser
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {!message.isUser && (
                        <Bot className="h-4 w-4 mt-0.5 text-red-600" />
                      )}
                      <div className="flex-1">
                        <p className="text-sm">{message.text}</p>
                        <p
                          className={`text-xs mt-1 ${
                            message.isUser ? 'text-red-100' : 'text-gray-500'
                          }`}
                        >
                          {message.timestamp.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      {message.isUser && (
                        <User className="h-4 w-4 mt-0.5 text-red-100" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {/* ✅ 맨 아래 ref */}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* 입력 영역 */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex gap-2">
              <Input
                value={inputMessage}
                onChange={e => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="메시지를 입력하세요..."
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || loading}
                size="sm"
                className="bg-red-600 hover:bg-red-700"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;