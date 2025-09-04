// src/App.tsx
import { useState, useEffect } from "react";
import { LoginPage } from "./pages/LoginPage";
import { MainPage } from "./pages/MainPage";
import { useAuth } from "./hooks/useAuth";

export function App() {
  const { isLoggedIn } = useAuth();
  const [page, setPage] = useState("login");

  useEffect(() => {
    if (isLoggedIn) setPage("main");
    else setPage("login");
  }, [isLoggedIn]);

  return (
    <>
      {page === "login" && <LoginPage onNavigate={setPage} />}
      {page === "main" && <MainPage onNavigate={setPage} />}
    </>
  );
}
