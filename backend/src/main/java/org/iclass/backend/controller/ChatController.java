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
                "You are a friendly chatbot who talks about movies with empathy, like a supportive friend.");

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