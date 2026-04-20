import { useState } from 'react'
  import { useNavigate, useLocation } from 'react-router-dom'
  import newGameActive from '../../assets/icons/navbar/icon_new_game_active.svg'
  import newGameInactive from '../../assets/icons/navbar/icon_new_game_inactive.svg'
  import previousGamesActive from '../../assets/icons/navbar/icon_previous_games_active.svg'
  import previousGamesInactive from '../../assets/icons/navbar/icon_previous_games_inactive.svg'
  import previousGamesActiveNotification from '../../assets/icons/navbar/icon_previous_games_active_notification.svg'
  import previousGamesInactiveNotification from '../../assets/icons/navbar/icon_previous_games_inactive_notification.svg'
  import profileActive from '../../assets/icons/navbar/icon_profile_active.svg'
  import profileInactive from '../../assets/icons/navbar/icon_profile_inactive.svg'
  import profileActiveNotification from '../../assets/icons/navbar/icon_profile_active_notification.svg'
  import profileInactiveNotification from '../../assets/icons/navbar/icon_profile_inactive_notification.svg'
  import './BottomNav.css'
  import { useNotifications } from '../../context/NotificationContext'

  const NAV_ITEMS = [
      { label: 'Nytt spel', path: '/new-game', active: newGameActive, inactive: newGameInactive },
      { label: 'Tidigare spel', path: '/previous-games', active: previousGamesActive, inactive: previousGamesInactive, activeNotification: previousGamesActiveNotification, inactiveNotification: previousGamesInactiveNotification },
      { label: 'Profil', path: '/profile', active: profileActive, inactive: profileInactive, activeNotification: profileActiveNotification, inactiveNotification: profileInactiveNotification },
  ]

  const IN_GAME_PATHS = ['/new-game/course', '/new-game/summary', '/new-game/scorecard', '/new-game/auto']

  function BottomNav() {
      const navigate = useNavigate()
      const location = useLocation()
      const { hasFriendRequest, hasNewGame } = useNotifications()
      const [pendingPath, setPendingPath] = useState<string | null>(null)

      const isInGame = IN_GAME_PATHS.some(p => location.pathname.startsWith(p))

      function handleNavClick(path: string) {
          if (isInGame && location.pathname !== path) {
              setPendingPath(path)
          } else {
              navigate(path)
          }
      }

      function getIcon(item: typeof NAV_ITEMS[number], isActive: boolean) {
          const hasNotification =
              (item.path === '/profile' && hasFriendRequest) ||
              (item.path === '/previous-games' && hasNewGame)

          if (hasNotification) {
              return isActive ? item.activeNotification! : item.inactiveNotification!
          }
          return isActive ? item.active : item.inactive
      }

      return (
          <>
              <nav className="bottom-nav">
                  {NAV_ITEMS.map(item => {
                      const isAvatar = location.pathname === '/edit-profile'
                      const isActive = isAvatar ? item.path === '/profile' : location.pathname.startsWith(item.path)
                      return (
                          <button key={item.path} className="bottom-nav__item" onClick={() => handleNavClick(item.path)}>
                              <img src={getIcon(item, isActive)} alt={item.label} className="bottom-nav__icon" />
                              <span className={isActive ? 'bottom-nav__label--active' : 'bottom-nav__label'}>{item.label}</span>
                          </button>
                      )
                  })}
              </nav>

              {pendingPath && (
                  <div className="warning-overlay">
                      <div className="warning-dialog">
                          <p>Du håller på med ett spel. Om du lämnar nu kommer ditt pågående spel att gå förlorat.</p>
                          <button onClick={() => { navigate(pendingPath); setPendingPath(null) }}>Lämna spelet</button>
                          <button onClick={() => setPendingPath(null)}>Avbryt</button>
                      </div>
                  </div>
              )}
          </>
      )
  }

  export default BottomNav