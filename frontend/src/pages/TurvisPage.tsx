import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { H1 } from '../components/typography/Typography'
import { useNewGame } from '../context/NewGameContext'
import { useAuth } from '../context/AuthContext'
import { submitScores } from '../api/games'
import type { Player } from '../context/NewGameContext'

function shuffled<T>(arr: T[]): T[] {
    const a = [...arr]
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[a[i], a[j]] = [a[j], a[i]]
    }
    return a
}

function orderForNextHole(players: Player[], holeScores: Record<string, Record<number, number>>, hole: number): Player[] {
    const withScores = players.map(p => ({ player: p, score: holeScores[p.id]?.[hole] ?? 7 }))
    const groups = new Map<number, Player[]>()
    for (const { player, score } of withScores) {
        if (!groups.has(score)) groups.set(score, [])
        groups.get(score)!.push(player)
    }
    const sorted = [...groups.entries()].sort((a, b) => a[0] - b[0])
    return sorted.flatMap(([, group]) => shuffled(group))
}

function TurvisPage() {
    const { players, courseName, holes, gameId, gamePlayerMap } = useNewGame()
    const { token } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const locationState = location.state as { scores?: Record<string, Record<number, number>> } | null

    const totalHoles = holes ?? 0
    const allHoles = Array.from({ length: totalHoles }, (_, i) => i + 1)

    const initialScores: Record<string, Record<number, number>> = locationState?.scores
        ? Object.fromEntries(players.map(p => [
            p.id,
            Object.fromEntries(
                Object.entries(locationState.scores![p.id] ?? {}).map(([h, s]) => [Number(h), s as number])
            )
          ]))
        : Object.fromEntries(players.map(p => [p.id, {}]))

    function findStart(scores: Record<string, Record<number, number>>) {
        let order = shuffled(players)
        for (let hi = 0; hi < allHoles.length; hi++) {
            if (hi > 0) order = orderForNextHole(players, scores, allHoles[hi - 1])
            for (let pi = 0; pi < order.length; pi++) {
                if (scores[order[pi].id]?.[allHoles[hi]] == null) {
                    return { holeIndex: hi, playerIndex: pi, order }
                }
            }
        }
        return { holeIndex: allHoles.length - 1, playerIndex: players.length - 1, order }
    }

    const start = findStart(initialScores)

    const [activeHoles, setActiveHoles] = useState(allHoles)
    const [holeScores, setHoleScores] = useState(initialScores)
    const [playerOrder, setPlayerOrder] = useState<Player[]>(start.order)
    const [currentPlayerIndex, setCurrentPlayerIndex] = useState(start.playerIndex)
    const [currentHoleIndex, setCurrentHoleIndex] = useState(start.holeIndex)
    const [currentScore, setCurrentScore] = useState(1)
    const [showSkipModal, setShowSkipModal] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [pendingFinalScores, setPendingFinalScores] = useState<Record<string, Record<number, number>> | null>(null)

    const currentHole = activeHoles[currentHoleIndex]
    const currentPlayer = playerOrder[currentPlayerIndex]
    const isLastPlayer = currentPlayerIndex === playerOrder.length - 1
    const isLastHole = currentHoleIndex === activeHoles.length - 1

    function nextButtonLabel() {
        if (isLastPlayer && isLastHole) return 'Rätta'
        if (isLastPlayer) return 'Nästa hål'
        return 'Nästa spelare'
    }

    function handleNext() {
        if (currentScore === 0) return

        const updatedScores = {
            ...holeScores,
            [currentPlayer.id]: { ...holeScores[currentPlayer.id], [currentHole]: currentScore }
        }
        setHoleScores(updatedScores)
        setCurrentScore(1)

        if (isLastPlayer && isLastHole) {
            setPendingFinalScores(updatedScores)
            setShowConfirm(true)
            return
        }

        if (isLastPlayer) {
            const nextHoleIndex = currentHoleIndex + 1
            const nextOrder = orderForNextHole(players, updatedScores, currentHole)
            setCurrentHoleIndex(nextHoleIndex)
            setPlayerOrder(nextOrder)
            setCurrentPlayerIndex(0)
        } else {
            setCurrentPlayerIndex(prev => prev + 1)
        }
    }

    async function submitAndFinish(finalScores: Record<string, Record<number, number>>) {
        if (!token || !gameId) return
        const scoreList = players.flatMap(p =>
            activeHoles
                .filter(h => finalScores[p.id]?.[h] != null)
                .map(h => ({
                    gamePlayerId: gamePlayerMap[p.id],
                    holeNumber: h,
                    strokes: finalScores[p.id][h],
                }))
        )
        await submitScores(token, gameId, scoreList)
        navigate('/new-game/animation', { state: { scores: finalScores } })
    }

    async function handleRattaAndå() {
        const filled = { ...holeScores }
        players.forEach(p => {
            activeHoles.forEach(h => {
                if (filled[p.id]?.[h] == null) filled[p.id] = { ...filled[p.id], [h]: 7 }
            })
        })
        await submitAndFinish(filled)
    }

    function handlePlockaHål() {
        const unplayed = activeHoles.filter(h =>
            players.every(p => holeScores[p.id]?.[h] == null)
        )
        setActiveHoles(prev => prev.filter(h => !unplayed.includes(h)))
        setShowSkipModal(false)
    }

    function handleSwitchToScorecard() {
        // Convert holeScores (only filled) to the Record<string, Record<number, number|null>> format scorecard expects
        const scorecardScores: Record<string, Record<number, number | null>> = Object.fromEntries(
            players.map(p => [
                p.id,
                Object.fromEntries(
                    Array.from({ length: totalHoles }, (_, i) => {
                        const h = i + 1
                        return [h, holeScores[p.id]?.[h] ?? null]
                    })
                )
            ])
        )
        navigate('/new-game/scorecard', { state: { fromTurvis: true, scores: scorecardScores } })
    }

    if (!currentPlayer) return null

    return (
        <>
            <div className="page page--centered">
                <H1>{courseName ?? 'Bana'}</H1>

                <div className="turvis-card" style={{ backgroundColor: '#2D2D2D' }}>
                    <span className="turvis-hole-label">Hål {currentHole}</span>
                    <span className="turvis-player-name">{currentPlayer.firstName} {currentPlayer.surname}s tur</span>

                    <div className="turvis-score-row">
                        <button
                            className="turvis-circle-btn"
                            style={{ backgroundColor: currentPlayer.color, visibility: currentScore > 1 ? 'visible' : 'hidden' }}
                            onClick={() => setCurrentScore(s => s - 1)}
                        >
                            −
                        </button>
                        <span className="turvis-score">{currentScore}</span>
                        <button
                            className="turvis-circle-btn"
                            style={{ backgroundColor: currentPlayer.color, visibility: currentScore < 7 ? 'visible' : 'hidden' }}
                            onClick={() => setCurrentScore(s => s + 1)}
                        >
                            +
                        </button>
                    </div>

                    <button
                        className="turvis-next-btn"
                        style={{
                            backgroundColor: currentPlayer.color,
                            border: nextButtonLabel() === 'Nästa hål' ? '3px solid white' : 'none',
                            color: 'white',
                            cursor: 'pointer',
                        }}
                        onClick={handleNext}
                    >
                        {nextButtonLabel()}
                    </button>
                </div>

                <div className="turvis-links">
                    <button className="ghost turvis-link-btn" onClick={() => setShowSkipModal(true)}>
                        Hoppa direkt till resultat
                    </button>
                    <button className="ghost turvis-link-btn" onClick={handleSwitchToScorecard}>
                        Börja fylla i formuläret själva
                    </button>
                </div>
            </div>

            {showConfirm && (
                <div className="warning-overlay">
                    <div className="warning-dialog">
                        <p>Är ni säkra på att ni vill rätta spelet?</p>
                        <button className="turvis-modal-btn" style={{ backgroundColor: currentPlayer.color }} onClick={() => { setShowConfirm(false); submitAndFinish(pendingFinalScores!) }}>Ja, rätta</button>
                        <button className="turvis-modal-btn" style={{ backgroundColor: '#555' }} onClick={() => setShowConfirm(false)}>Avbryt</button>
                    </div>
                </div>
            )}

            {showSkipModal && (
                <div className="warning-overlay">
                    <div className="warning-dialog">
                        <p>Alla har inte spelat på varje hål. Om du väljer att rätta nu kommer alla ospelade hål automatiskt få 7 poäng. Om du tog miste på antalet hål kan du välja att plocka bort de hål som är helt ospelade.</p>
                        <button className="turvis-modal-btn" style={{ backgroundColor: currentPlayer.color }} onClick={handleRattaAndå}>Rätta ändå</button>
                        <button className="turvis-modal-btn" style={{ backgroundColor: currentPlayer.color }} onClick={handlePlockaHål}>Plocka bort hål</button>
                        <button className="turvis-modal-btn" style={{ backgroundColor: '#555' }} onClick={() => setShowSkipModal(false)}>Avbryt</button>
                    </div>
                </div>
            )}
        </>
    )
}

export default TurvisPage
