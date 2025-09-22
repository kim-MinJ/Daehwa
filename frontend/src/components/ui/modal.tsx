import { ReactNode, useEffect } from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  // ESC 키로 닫기
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 배경 */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* 모달 박스 */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 p-6 z-10">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-4">
          {title && <h2 className="text-lg font-bold text-black">{title}</h2>}
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-200 transition"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* 내용 */}
        <div>{children}</div>
      </div>
    </div>
  );
}