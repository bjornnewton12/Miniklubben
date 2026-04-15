import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { H1, H2 } from '../components/typography/Typography'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import { useNewGame } from '../context/NewGameContext'
import { AVATARS } from '../constants/avatars'
import { assignColors } from '../utils/assignColors'
import { getDisplayNames } from '../utils/getDisplayNames'
import { useAuth } from '../context/AuthContext'
import { createGame } from '../api/games'

function SummaryPage() {
    const { players, setPlayers, setGameId, setGamePlayerMap, courseId, holes, courseName, courseImageUrl } = useNewGame()
    const { token } = useAuth()
    const navigate = useNavigate()
    const displayNames = getDisplayNames(players)


    useEffect(() => {
        if (players.length === 0) return
        const colorMap = assignColors(players)
        setPlayers(players.map(p => ({ ...p, color: colorMap.get(p.id) ?? p.color })))
    }, [])

    async function handleStart() {
        if (!token || !courseId || !holes) return
        const result = await createGame(
            token,
            courseId,
            holes,
            players.map(p => p.id.startsWith('guest-')
                ? { guestName: p.firstName }
                : { userId: p.id })
        )
        if (!result) return
        setGameId(result.id)
        const map: Record<string, string> = {}
        players.forEach((p, i) => { map[p.id] = result.players[i].id })
        setGamePlayerMap(map)
        navigate('/new-game/scorecard')
    }

    return (
        <div className="page">
            <H1>Nytt spel</H1>
            <Card className="card--full">
                <button className="ghost back-button" onClick={() => navigate(-1)}>{'< Tillbaka'}</button>
                <H2>Sammanfattning</H2>

                <H2>Spelare</H2>
                <div className="player-grid">
                    {players.map(player => (
                        <div key={player.id} className="player-item">
                            <div className="player-circle" style={{ backgroundColor: player.color }}>
                                {(() => { const av = AVATARS.find(a => a.id === player.avatarId); return av ? <img src={av.src} className="avatar-img" alt="" /> : null })()}
                            </div>
                            <span className="label">{displayNames.get(player.id)}</span>
                        </div>
                    ))}
                </div>

                <H2>Bana</H2>
                <div className="summary-course">
                    <div className="course-thumbnail">
                        {courseImageUrl && <img src={courseImageUrl} alt={courseName ?? ''} />}
                    </div>
                    <div className="summary-course-info">
                        <strong>{courseName ?? '—'}</strong>
                        <span>{holes ?? '—'} hål</span>
                    </div>
                </div>

                <Button onClick={handleStart}>Börja spela!</Button>
            </Card>
        </div>
    )
}

export default SummaryPage