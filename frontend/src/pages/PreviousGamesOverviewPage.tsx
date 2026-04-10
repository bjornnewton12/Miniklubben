import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { H1 } from '../components/typography/Typography'
import { useAuth } from '../context/AuthContext'
import { getUserGames, type UserGameSummary } from '../api/games'
import { useNotifications } from '../context/NotificationContext'

function PreviousGamesPage() {
    const { token } = useAuth()
    const navigate = useNavigate()
    const [games, setGames] = useState<UserGameSummary[]>([])
    const { markGamesSeen } = useNotifications()

    useEffect(() => {
        markGamesSeen()
        if (token) getUserGames(token).then(setGames)
    }, [token])

    function formatDate(dateStr: string | null) {
        if (!dateStr) return '—'
        const d = new Date(dateStr)
        return `${d.getDate()}/${d.getMonth() + 1}-${d.getFullYear()}`
    }

    return (
        <div className="page">
            <H1>Tidigare spel</H1>
            <div className='card card--full'>
                {games.length === 0 && (
                    <p className="paragraph">När du spelat en omgång dyker den upp här</p>
                )}
                <div className="course-grid">
                    {games.map(game => (
                        <div key={game.id} className="course-item" onClick={() =>
                            navigate(`/previous-games/${game.id}`, { state: { game } })}>
                            <div className="course-thumbnail">
                                {game.courseImageUrl && <img src={game.courseImageUrl} alt={game.courseName} />}
                            </div>
                            <span className="label"><strong>{game.courseName}</strong></span>
                            <span className="label">{formatDate(game.completedAt)}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default PreviousGamesPage