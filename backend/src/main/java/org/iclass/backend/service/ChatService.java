package org.iclass.backend.service;

import org.iclass.backend.dto.ChatRequest;
import org.iclass.backend.dto.ChatResponse;
import org.iclass.backend.entity.ChatMessageEntity;
import org.iclass.backend.entity.UsersEntity;
import org.iclass.backend.repository.ChatMessageRepository;
import org.iclass.backend.repository.UsersRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ChatService {

  @Value("${openai.api.key}")
  private String apiKey;

  private final ChatMessageRepository chatMessageRepository;
  private final UsersRepository usersRepository;

  private final WebClient webClient = WebClient.builder()
      .baseUrl("https://api.openai.com/v1")
      .defaultHeader("Content-Type", "application/json")
      .build();

  public ChatResponse getChatCompletion(ChatRequest request, String userId) {
    // ✅ 로그인한 유저 찾기 (없으면 null = 게스트 모드)
    UsersEntity user = null;
    if (request.getUserId() != null && !request.getUserId().isBlank()) {
      user = usersRepository.findByUserId(userId).orElse(null);
    }

    System.out.println("챗서비스 요청 userId:" + userId);

    // ✅ 유저 메시지 저장 (로그인한 경우만)
    if (user != null) {
      for (ChatRequest.Message msg : request.getMessages()) {
        if ("user".equals(msg.getRole())) {
          chatMessageRepository.save(ChatMessageEntity.builder()
              .role("user")
              .content(msg.getContent())
              .createdAt(LocalDateTime.now())
              .user(user)
              .build());
        }
      }
    }

    // ✅ OpenAI API 호출
    ChatResponse response = webClient.post()
        .uri("/chat/completions")
        .header("Authorization", "Bearer " + apiKey)
        .bodyValue(new ChatCompletionPayload("gpt-4o-mini", request.getMessages()))
        .retrieve()
        .bodyToMono(ChatResponse.class)
        .block();

    // ✅ Assistant 메시지 저장 (로그인한 경우만)
    if (user != null && response != null && response.getChoices() != null && !response.getChoices().isEmpty()) {
      String reply = response.getChoices().get(0).getMessage().getContent();
      chatMessageRepository.save(ChatMessageEntity.builder()
          .role("assistant")
          .content(reply)
          .createdAt(LocalDateTime.now())
          .user(user)
          .build());
    }

    return response;
  }

  // ✅ OpenAI 요청 DTO
  record ChatCompletionPayload(String model, java.util.List<ChatRequest.Message> messages) {
  }
}