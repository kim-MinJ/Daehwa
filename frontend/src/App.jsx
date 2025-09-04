import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        {/* 나중에 메인 페이지 만들면 여기에 추가 */}
      </Routes>
    </Router>
  );
}

export default App;