import { useNavigate } from 'react-router-dom'
import { H1 } from '../components/typography/Typography'
import Card from '../components/common/Card'

const DUMMY_GAMES = [
    {
        id: '1',
        courseName: 'Aspuddens Bangolf',
        date: '31/03-2026',
        players: [
            { id: 'p1', username: 'DetÄrJag', color: '#45AC7F', total: 47 },
            { id: 'p2', username: 'Agnes', color: '#FE9377', total: 51 },
            { id: 'p3', username: 'Bo', color: '#4B69FE', total: 54 },
        ]
    },
    {
        id: '2',
        courseName: 'Liseberg',
        date: '28/03-2026',
        players: [
            { id: 'p1', username: 'DetÄrJag', color: '#45AC7F', total: 39 },
            { id: 'p4', username: 'Cecilia', color: '#F6B859', total: 42 },
        ]
    },
    {
        id: '3',
        courseName: 'Slottsskogen',
        date: '20/03-2026',
        players: [
            { id: 'p1', username: 'DetÄrJag', color: '#45AC7F', total: 55 },
            { id: 'p2', username: 'Agnes', color: '#FE9377', total: 48 },
            { id: 'p5', username: 'Dawit', color: '#F81803', total: 61 },
            { id: 'p6', username: 'Erica', color: '#4B69FE', total: 44 },
        ]
    },
]

function PreviousGamesPage() {
    const navigate = useNavigate()

    return (
        <div className="page">
            <H1>Tidigare spel</H1>
            <Card>
            <div className="course-grid">
                {DUMMY_GAMES.map(game => (
                    <div key={game.id} className="course-item" onClick={() =>
                        navigate(`/previous-games/${game.id}`, { state: { game } })}>
                        <div className="course-thumbnail" />
                        <span className="player-label">{game.courseName}</span>
                        <span className="player-label">{game.date}</span>
                    </div>
                ))}
            </div>
            </Card>
        </div>
    )
}

export default PreviousGamesPage