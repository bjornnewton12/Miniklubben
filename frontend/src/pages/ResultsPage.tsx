import { useLocation } from "react-router-dom"
import { useNewGame } from "../context/NewGameContext"
import { AVATARS } from "../constants/avatars"
import { getDisplayNames } from "../utils/getDisplayNames"

function hexToRgba(hex: string, alpha: number) {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

function ResultsPage() {
    const { players, courseName } = useNewGame()
    const { state } = useLocation()
    const scores: Record<string, Record<number, number>> = state?.scores ?? {}

    const displayNames = getDisplayNames(players)
    const holes = Array.from(new Set(players.flatMap(p => Object.keys(scores[p.id] ?? {}).map(Number)))).sort((a, b) => a - b)

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

            <div className="summarycard summarycard--full" style={{ padding: '15px 1px' }}>
                <div className="scorecard-wrapper">
                    <table className="scorecard-table">
                        <thead>
                            <tr>
                                <th className="scorecard-hole-header"></th>
                                {players.map(p => (
                                    <th key={p.id} className="scorecard-player-header">
                                        <span>{displayNames.get(p.id)}</span>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {holes.map(hole => (
                                <tr key={hole}>
                                    <td className="scorecard-hole-cell">{hole}.</td>
                                    {players.map(p => (
                                        <td
                                            key={p.id}
                                            className="scorecard-score-cell"
                                            style={{
                                                backgroundColor: hexToRgba(p.color, hole % 2 !== 0 ? 0.5 : 0.3),
                                                cursor: 'default',
                                            }}
                                        >
                                            {scores[p.id]?.[hole] ?? '-'}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default ResultsPage