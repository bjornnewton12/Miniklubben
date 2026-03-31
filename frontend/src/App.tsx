import { Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom'
import BottomNav from './components/common/BottomNav'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import AvatarPage from './pages/AvatarPage'
import NewGamePage from './pages/NewGamePage'
import CoursePage from './pages/CoursePage'
import HolesPage from './pages/HolesPage'
import SummaryPage from './pages/SummaryPage'
import ScorecardPage from './pages/ScorecardPage'
import ProfilePage from './pages/ProfilePage'
import ResultsPage from './pages/ResultsPage'
import { NewGameProvider } from './context/NewGameContext'
import PreviousGamesOverviewPage from './pages/PreviousGamesOverviewPage'
import PreviousGameResultsPage from './pages/PreviousGameResultsPage'

const HIDE_NAV_ROUTES = ['/login', '/register', '/avatar']

function App() {
  const location = useLocation()
  const showNav = !HIDE_NAV_ROUTES.includes(location.pathname)

  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/new-game" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/avatar" element={<AvatarPage />} />
        <Route path="/new-game" element={<NewGameProvider><Outlet /></NewGameProvider>}>
          <Route index element={<NewGamePage />} />
          <Route path="course" element={<CoursePage />} />
          <Route path="holes" element={<HolesPage />} />
          <Route path="summary" element={<SummaryPage />} />
          <Route path="scorecard" element={<ScorecardPage />} />
          <Route path="results" element={<ResultsPage />} />
        </Route>
        <Route path="/previous-games" element={<PreviousGamesOverviewPage />} />
        <Route path="/previous-games/:id" element={<PreviousGameResultsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
      {showNav && <BottomNav />}
    </>
  )
}

export default App