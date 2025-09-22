package org.iclass.backend.controller;

import org.iclass.backend.dto.ChatRequest;
import org.iclass.backend.dto.ChatResponse;
import org.iclass.backend.entity.ChatMessageEntity;
import org.iclass.backend.entity.UsersEntity;
import org.iclass.backend.repository.ChatMessageRepository;
import org.iclass.backend.repository.UsersRepository;
import org.iclass.backend.service.ChatService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;
    private final UsersRepository usersRepository;
    private final ChatMessageRepository chatMessageRepository;

    @PostMapping
    public ChatResponse chat(@RequestBody ChatRequest request, Authentication authentication) {
        // system role 추가
        String userId;
        if (authentication != null) {
            // 로그인 사용자
            userId = authentication.getName();
        } else {
            // 비회원 사용자 → 임시 guest 아이디 부여
            userId = "guest-" + System.currentTimeMillis();
        }
        log.info("컨트롤러 요청 userId: {}", request.getUserId());
        ChatRequest.Message systemMessage = new ChatRequest.Message();
        systemMessage.setRole("system");
        systemMessage.setContent(
                "You are a friendly chatbot who talks about movies with empathy, like a supportive friend. 주로 영화에 대해 대화할꺼고 영화외의 주제에 대해 사용자가 말을 걸면 자연스럽게 영화에 대한 주제로 옮겨가도록 해.You are a friendly and empathetic movie companion chatbot for the MovieSSG platform.  \r\n"
                        + //
                        "Your primary goal is to talk about movies in a warm, supportive, and human-like way, making users feel heard and understood.  \r\n"
                        + //
                        "\r\n" + //
                        "### Personality & Tone\r\n" + //
                        "- Speak like a caring friend who loves movies.  \r\n" + //
                        "- Be empathetic: acknowledge the user’s feelings, respond warmly, and use encouraging words.  \r\n"
                        + //
                        "- Mix casual conversation with insightful movie knowledge.  \r\n" + //
                        "- Avoid being overly robotic or factual only. Always balance data with emotional engagement.  \r\n"
                        + //
                        "\r\n" + //
                        "### Capabilities\r\n" + //
                        "1. Movie Information\r\n" + //
                        "   - Provide details from TMDB, IMDB, and KOFIC (영진청) such as synopsis, cast, director, box office, and ratings.  \r\n"
                        + //
                        "   - If relevant, add trivia, behind-the-scenes facts, or recommendations for similar films.  \r\n"
                        + //
                        "\r\n" + //
                        "2. Recommendations\r\n" + //
                        "   - Suggest movies based on mood, genre, or emotional context (e.g., “위로 받고 싶어요” → 따뜻한 힐링 영화 추천).  \r\n"
                        + //
                        "   - Always explain *why* you recommend a movie, in an empathetic tone.  \r\n" + //
                        "\r\n" + //
                        "3. Empathy\r\n" + //
                        "   - If the user expresses emotions (happy, sad, lonely, excited), respond with understanding.  \r\n"
                        + //
                        "   - Example: “오늘 기분이 우울해요” → “그럴 때는 마음을 위로해주는 영화를 보는 것도 좋아요. 혹시 ‘월터의 상상은 현실이 된다’를 들어보셨나요?”  \r\n"
                        + //
                        "\r\n" + //
                        "4. Conversation Style\r\n" + //
                        "   - Use short, natural sentences. Add emojis occasionally 😊🎬.  \r\n" + //
                        "   - Encourage back-and-forth conversation by asking gentle follow-up questions.  \r\n" + //
                        "\r\n" + //
                        "### Restrictions\r\n" + //
                        "- Never give harmful, explicit, or pirated content.  \r\n" + //
                        "- Do not make up fake movie data. If unsure, say you’re not certain.  \r\n" + //
                        "- Keep answers concise but caring, expanding only if the user shows interest.  \r\n" + //
                        "\r\n" + //
                        "Remember:  \r\n" + //
                        "You are not just a movie database, but a *friend who talks about movies with empathy*.  \r\n" + //
                        "");

        request.getMessages().add(0, systemMessage);

        return chatService.getChatCompletion(request, userId);
    }

    // ✅ 특정 유저의 대화 기록
    @GetMapping("/history/{userId}")
    public List<ChatMessageEntity> getHistory(@PathVariable String userId) {
        UsersEntity user = usersRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return chatMessageRepository.findByUser(user);
    }
}