import { useLocation } from "react-router-dom"
import { useNewGame } from "../context/NewGameContext"
import { AVATARS } from "../constants/avatars"

function ResultsPage() {
    const { players, courseName } = useNewGame()
    const { state } = useLocation()
    const scores: Record<string, Record<number, number>> = state?.scores ?? {}

    const ranked = players
        .map(p => ({
            ...p,
            total: Object.values(scores[p.id] ?? {}).reduce((sum, s) => sum + s, 0)
        }))
        .sort((a, b) => a.total - b.total)

    return (
        <div className="page">
            <div className="h3">Resultat</div>
            <div className="h1">{courseName ?? 'Bana'}</div>
            <div className="card card--full">
                {ranked.map((p) => (
                    <div key={p.id} className="results-row">
                        <div className="results-avatar" style={{ backgroundColor: p.color }}>
                                {(() => { const av = AVATARS.find(a => a.id === p.avatarId); return av ? <img src={av.src} className="avatar-img" alt="" /> : null })()}
                            </div>
                        <div>
                            <div className="result-label">Plats {ranked.findIndex(r => r.total === p.total) + 1} med {(p.total)} poäng</div>
                            <div className="h2Result">{p.firstName} {p.surname}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ResultsPage