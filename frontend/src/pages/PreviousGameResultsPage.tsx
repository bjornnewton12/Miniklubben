import { useNavigate, useLocation } from 'react-router-dom'
import { H1, H2 } from '../components/typography/Typography'
import type { UserGameSummary } from '../api/games'
import { AVATARS } from '../constants/avatars'

function PreviousGameResultsPage() {
    const navigate = useNavigate()
    const { state } = useLocation()
    const game: UserGameSummary = state?.game
    console.log(game)

    return (
        <div className="page">
            <H1>{game.courseName}</H1>
            <div className="card card--full">
                <button className="ghost back-button" onClick={() =>
                    navigate('/previous-games')}>{'< Tillbaka'}</button>
                <H2>Resultat</H2>
                {game.players.map((p, i) => (
                    <div key={i} className="results-row">
                        <div className="results-avatar" style={{ backgroundColor: p.colorHex ?? '#55D379' }}>
                         {(() => { const av = AVATARS.find(a => a.id === p.avatarId); return av ? <img src={av.src} className="avatar-img" alt="" /> : null })()}
                         </div>
                        <div>
                            <div className="result-label">Plats {p.rank} med {p.finalScore} poäng</div>
                            <div className="h2Result">{p.firstName} {p.surname}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default PreviousGameResultsPage