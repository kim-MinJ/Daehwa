package org.iclass.backend.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class RedirectController {

  // React 앱의 진입점
  @GetMapping({ "/", "/login", "/mypage" })
  public String index() {
    return "index"; // src/main/resources/static/index.html
  }
}