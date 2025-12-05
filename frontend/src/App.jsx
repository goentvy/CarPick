import CarDetailPage from './pages/CarDetailPage.jsx';
import './App.css'
import { Outlet, Link } from 'react-router-dom'

function App() {
  return (
    <div>
      <nav>
        <Link to="/">홈</Link> | <Link to="/login">로그인</Link> | <Link to="/profile">프로필</Link>
      </nav>
      <hr />
      <CarDetailPage />;
      {/* 자식 라우트가 렌더링되는 자리 */}
      <Outlet />
    </div>
  )
}
export default App
