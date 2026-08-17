import { Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom'
import BottomNav from './components/common/BottomNav'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import EditProfilePage from './pages/EditProfilePage'
import NewGamePage from './pages/NewGamePage'
import CoursePage from './pages/CoursePage'
import SummaryPage from './pages/SummaryPage'
import GameManualPage from './pages/GameManualPage'
import ProfilePage from './pages/ProfilePage'
import ResultsPage from './pages/ResultsPage'
import { NewGameProvider } from './context/NewGameContext'
import { NotificationProvider } from './context/NotificationContext'
import PreviousGamesOverviewPage from './pages/PreviousGamesOverviewPage'
import PreviousGameResultsPage from './pages/PreviousGameResultsPage'
import FriendProfilePage from './pages/FriendProfilePage'
import AnimationResultsPage from './pages/AnimationResultsPage'
import GameAutoPage from './pages/GameAutoPage'
import AdminPage from './pages/AdminPage'
import { useAuth } from './context/AuthContext'

const HIDE_NAV_ROUTES = ['/login', '/register', '/new-game/scorecard', '/new-game/auto']

function RequireAuth() {
  const { token } = useAuth()
  const location = useLocation()
  if (!token) return <Navigate to="/login" state={{ from: location }} replace />
  return <Outlet />
}

function App() {
  const location = useLocation()
  const isRegisteringAvatar = location.pathname === '/edit-profile' && (location.state as any)?.username
  const showNav = !HIDE_NAV_ROUTES.includes(location.pathname) && !isRegisteringAvatar

  return (
    <NotificationProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/edit-profile" element={<EditProfilePage />} />

        <Route element={<RequireAuth />}>
          <Route path="/" element={<Navigate to="/profile" replace />} />
          <Route path="/new-game" element={<NewGameProvider><Outlet /></NewGameProvider>}>
            <Route index element={<NewGamePage />} />
            <Route path="course" element={<CoursePage />} />
            <Route path="summary" element={<SummaryPage />} />
            <Route path="scorecard" element={<GameManualPage />} />
            <Route path="auto" element={<GameAutoPage />} />
            <Route path="animation" element={<AnimationResultsPage />} />
            <Route path="results" element={<ResultsPage />} />
          </Route>
          <Route path="/previous-games" element={<PreviousGamesOverviewPage />} />
          <Route path="/previous-games/:id" element={<PreviousGameResultsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/friend/:userId" element={<FriendProfilePage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Route>
      </Routes>
      {showNav && <BottomNav />}
    </NotificationProvider>
  )
}

export default App
