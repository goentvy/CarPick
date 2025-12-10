import { Outlet } from "react-router-dom";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

function App() {
  return (
    <div className="App">
      {/* 공통 헤더 */}
      <Header />

      {/* 자식 라우트 출력 */}
      <Outlet />

      {/* 공통 폿더 */}
      <Footer />
    </div>
  );
}

export default App;
