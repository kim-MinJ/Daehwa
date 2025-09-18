import { useLocation, useNavigate } from "react-router-dom";

export default function ErrorPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { message?: string; code?: number };
  const message = state?.message || "페이지를 찾을 수 없습니다.";
  const code = state?.code || 404;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-800">
      <h1 className="text-6xl font-bold mb-4">{code}</h1>
      <p className="text-xl mb-6">{message}</p>
      <button
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        onClick={() => navigate("/")}
      >
        홈으로 돌아가기
      </button>
    </div>
  );
}