import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { H1, H2 } from '../components/typography/Typography'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import { useNewGame } from '../context/NewGameContext'
import { AVATARS } from '../constants/avatars'
import { assignColors } from '../utils/assignColors'

function SummaryPage() {
    const { players, setPlayers, courseName, holes } = useNewGame()
    const navigate = useNavigate()

    useEffect(() => {
        if (players.length === 0) return
        const colorMap = assignColors(players)
        setPlayers(players.map(p => ({ ...p, color: colorMap.get(p.id) ?? p.color })))
    }, [])

    return (
        <div className="page">
            <H1>Nytt spel</H1>
            <Card>
                <button className="ghost" onClick={() => navigate(-1)}>{'< Tillbaka'}</button>
                <H2>Sammanfattning</H2>

                <H2>Spelare</H2>
                <div className="player-grid">
                    {players.map(player => (
                        <div key={player.id} className="player-item">
                            <div className="player-circle" style={{ backgroundColor: player.color }}>
                                {(() => { const av = AVATARS.find(a => a.id === player.avatarId); return av ? <img src={av.src} className="avatar-img" alt="" /> : null })()}
                            </div>
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