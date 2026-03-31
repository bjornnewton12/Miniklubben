import { useLocation } from "react-router-dom"
import { useNewGame } from "../context/NewGameContext"
import { useAuth } from "../context/AuthContext"

const DUMMY_FRIENDS = [
    { id: '1', username: 'Agnes', color: '#45AC7F' },
    { id: '2', username: 'Bo', color: '#FE9377' },
    { id: '3', username: 'Cecilia', color: '#4B69FE' },
    { id: '4', username: 'Dawit', color: '#4B69FE' },
    { id: '5', username: 'Erica', color: '#F81803' },
    { id: '6', username: 'Filip', color: '#F6B859' },
]

function ResultsPage() {
    const { selectedIds, guests, courseName } = useNewGame()
    const { userId, username: currentUsername, topColor } = useAuth()
    const currentUser = { id: userId!, username: currentUsername!, color: topColor ?? '#6b6b6b' }
    const { state } = useLocation()
    const scores: Record<string, Record<number, number>> = state?.scores ?? {}

    const allPlayers = [currentUser, ...DUMMY_FRIENDS, ...guests]
    const selectedPlayers = allPlayers.filter(p => selectedIds.includes(p.id))

    const ranked = selectedPlayers
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
                {ranked.map((p, i) => (
                    <div key={p.id} className="results-row">
                        <div className="results-avatar" style={{ backgroundColor: p.color }} />
                        <div>
                            <div className="h3Result">Plats {i + 1} med {(p.total)} poäng</div>
                            <div className="h2Result">{p.username}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ResultsPage