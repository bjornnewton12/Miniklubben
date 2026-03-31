import { useNavigate } from 'react-router-dom'
  import { H1, H2 } from '../components/typography/Typography'
  import Card from '../components/common/Card'
  import Button from '../components/common/Button'
  import { useNewGame } from '../context/NewGameContext'
  import { useAuth } from '../context/AuthContext'

  const DUMMY_FRIENDS = [
      { id: '1', username: 'Agnes', color: '#45AC7F' },
      { id: '2', username: 'Bo', color: '#FE9377' },
      { id: '3', username: 'Cecilia', color: '#4B69FE' },
      { id: '4', username: 'Dawit', color: '#4B69FE' },
      { id: '5', username: 'Erica', color: '#F81803' },
      { id: '6', username: 'Filip', color: '#F6B859' },
  ]

  function SummaryPage() {
      const { selectedIds, guests, courseName, holes } = useNewGame()
      const { userId, username: currentUsername, topColor } = useAuth()
      const currentUser = { id: userId!, username: currentUsername!, color: topColor ?? '#6b6b6b' }
      const navigate = useNavigate()

      const allPlayers = [currentUser, ...DUMMY_FRIENDS, ...guests]
      const selectedPlayers = allPlayers.filter(p => selectedIds.includes(p.id))

      return (
          <div className="page">
              <H1>Nytt spel</H1>
              <Card>
                  <button className="ghost" onClick={() => navigate(-1)}>{'< Tillbaka'}</button>
                  <H2>Sammanfattning</H2>

                  <H2>Spelare</H2>
                  <div className="player-grid">
                      {selectedPlayers.map(player => (
                          <div key={player.id} className="player-item">
                              <div className="player-circle" style={{ backgroundColor: player.color }} />
                              <span className="player-label">{player.username}</span>
                          </div>
                      ))}
                  </div>

                  <H2>Bana</H2>
                  <div className="summary-course">
                      <div className="course-thumbnail" />
                      <div className="summary-course-info">
                          <strong>{courseName ?? '—'}</strong>
                          <span>{holes ?? '—'} hål</span>
                      </div>
                  </div>

                  <Button onClick={() => navigate('/new-game/scorecard')}>Börja spela!</Button>
              </Card>
          </div>
      )
  }

  export default SummaryPage