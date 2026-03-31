import { useNavigate, useLocation } from 'react-router-dom'
  import newGameActive from '../../assets/icons/icon_new_game_active.svg'
  import newGameInactive from '../../assets/icons/icon_new_game_inactive.svg'
  import previousGamesActive from '../../assets/icons/icon_previous_games_active.svg'
  import previousGamesInactive from '../../assets/icons/icon_previous_games_inactive.svg'
  import profileActive from '../../assets/icons/icon_profile_active.svg'
  import profileInactive from '../../assets/icons/icon_profile_inactive.svg'
  import './BottomNav.css'

  const NAV_ITEMS = [
      { label: 'Nytt spel', path: '/new-game', active: newGameActive, inactive: newGameInactive },
      { label: 'Tidigare spel', path: '/previous-games', active: previousGamesActive, inactive: previousGamesInactive },
      { label: 'Profil', path: '/profile', active: profileActive, inactive: profileInactive
    },
    ]

  function BottomNav() {
      const navigate = useNavigate()
      const location = useLocation()

      return (
          <nav className="bottom-nav">
              {NAV_ITEMS.map(item => {
                  const isActive = location.pathname.startsWith(item.path)
                  return (
                      <button key={item.path} className="bottom-nav__item" onClick={() => navigate(item.path)}>
                          <img src={isActive ? item.active : item.inactive} alt={item.label} className="bottom-nav__icon" />
                          <span className={isActive ? 'bottom-nav__label--active' : 'bottom-nav__label'}>{item.label}</span>
                      </button>
                  )
              })}
          </nav>
      )
  }

  export default BottomNav