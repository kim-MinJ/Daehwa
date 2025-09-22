// src/hooks/useBackspaceNavigate.ts
import { useEffect } from "react";

/**
 * 백스페이스로 뒤로가기 훅
 * input/textarea/contentEditable에 포커스가 있으면 동작하지 않음
 */
export function useBackspaceNavigate() {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Backspace") return;

      const target = e.target as HTMLElement;
      const tagName = target.tagName.toLowerCase();

      // 입력 필드에서는 무시
      const isEditable =
        tagName === "input" ||
        tagName === "textarea" ||
        target.isContentEditable;
      if (isEditable) return;

      e.preventDefault(); // 기본 동작 막기
      window.history.back(); // 브라우저 히스토리 뒤로가기
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
}
