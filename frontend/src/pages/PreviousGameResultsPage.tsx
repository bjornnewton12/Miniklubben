import { useNavigate, useLocation } from 'react-router-dom'
import { H1, H2 } from '../components/typography/Typography'

type Player = {
    id: string
    username: string
    color: string
    total: number
}

type Game = {
    id: string
    courseName: string
    date: string
    players: Player[]
}

function PreviousGameResultsPage() {
    const navigate = useNavigate()
    const { state } = useLocation()
    const game: Game = state?.game

    const ranked = [...game.players].sort((a, b) => a.total - b.total)

    return (
        <div className="page">
            <H1>{game.courseName}</H1>
            <div className="card card--full">
                <button className="ghost" style={{ marginLeft: 0 }} onClick={() =>
                    navigate('/previous-games')}>{'< Tillbaka'}</button>
                <H2>Resultat</H2>
                {ranked.map((p, i) => (
                    <div key={p.id} className="results-row">
                        <div className="results-avatar" style={{
                            backgroundColor: p.color
                        }} />
                        <div>
                            <div className="h3Result">Plats {i + 1} med {p.total} poäng</div>
                            <div className="h2Result">{p.username}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default PreviousGameResultsPage