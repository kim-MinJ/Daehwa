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

  public ChatResponse getChatCompletion(ChatRequest request) {
    // ✅ userId로 유저 찾기 (없으면 예외 발생)
    UsersEntity user = usersRepository.findByUserId(request.getUserId())
        .orElseThrow(() -> new RuntimeException("User not found"));

    // user 메시지 저장
    request.getMessages().forEach(msg -> {
      if ("user".equals(msg.getRole())) {
        chatMessageRepository.save(ChatMessageEntity.builder()
            .role("user")
            .content(msg.getContent())
            .createdAt(LocalDateTime.now())
            .user(user)
            .build());
      }
    });

    // OpenAI 호출
    ChatResponse response = webClient.post()
        .uri("/chat/completions")
        .header("Authorization", "Bearer " + apiKey)
        .bodyValue(new ChatCompletionPayload("gpt-4.0-mini", request.getMessages()))
        .retrieve()
        .bodyToMono(ChatResponse.class)
        .block();

    // assistant 메시지 저장
    if (response != null && response.getChoices() != null && !response.getChoices().isEmpty()) {
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

  record ChatCompletionPayload(String model, java.util.List<ChatRequest.Message> messages) {
  }
}