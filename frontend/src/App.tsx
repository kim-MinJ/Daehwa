import { useState } from "react";
import { LoginPage } from "./pages/LoginPage";
import { MainPage } from "./pages/MainPage";
import { MyPage } from "./pages/MyPage";

export function App() {
  const [page, setPage] = useState("login"); // login | main | mypage

  const handleNavigate = (target: string) => {
    setPage(target);
  };

  return (
    <>
      {page === "login" && <LoginPage onNavigate={handleNavigate} />}
      {page === "main" && <MainPage onNavigate={handleNavigate} />}
      {page === "mypage" && <MyPage onNavigate={handleNavigate} />}
    </>
  );
}
