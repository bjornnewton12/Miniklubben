import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { H1 } from '../components/typography/Typography'
import Button from '../components/common/Button'
import NumberPad from '../components/game/NumberPad'
import { useNewGame } from '../context/NewGameContext'
import { useAuth } from '../context/AuthContext'
import { submitScores } from '../api/games'
import { getDisplayNames } from '../utils/getDisplayNames'

function hexToRgba(hex: string, alpha: number) {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

function GameManualPage() {
    const { players, courseName, holes, gameId, gamePlayerMap } = useNewGame()
    const { token } = useAuth()
    const selectedPlayers = players
    const navigate = useNavigate()
    const location = useLocation()
    const locationState = location.state as { fromAuto?: boolean; scores?: Record<string, Record<number, number | null>> } | null
    const holeCount = holes ?? 0
    const displayNames = getDisplayNames(selectedPlayers)

    const [showModeModal, setShowModeModal] = useState(!locationState?.fromAuto)
    const [scores, setScores] = useState<Record<string, Record<number, number | null>>>(
        locationState?.scores ??
        Object.fromEntries(selectedPlayers.map(p => [p.id, Object.fromEntries(
            Array.from({ length: holeCount }, (_, i) => [i + 1, null])
        )]))
    )

    const [activeHoles, setActiveHoles] = useState<number[]>(
        Array.from({ length: holeCount }, (_, i) => i + 1)
    )
    const [activeCell, setActiveCell] = useState<{ playerId: string; hole: number } | null>(null)
    const [showWarning, setShowWarning] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const rowRefs = useRef<Record<number, HTMLTableRowElement | null>>({})

    useEffect(() => {
        if (!activeCell) return
        rowRefs.current[activeCell.hole]?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, [activeCell])

    function handleSelect(value: number) {
        if (!activeCell) return
        setScores(prev => ({
            ...prev,
            [activeCell.playerId]: { ...prev[activeCell.playerId], [activeCell.hole]: value }
        }))
    }

    function handleDelete() {
        if (!activeCell) return
        setScores(prev => ({
            ...prev,
            [activeCell.playerId]: { ...prev[activeCell.playerId], [activeCell.hole]: null }
        }))
    }

    function navigateToAuto() {
        const autoScores: Record<string, Record<number, number>> = Object.fromEntries(
            selectedPlayers.map(p => [
                p.id,
                Object.fromEntries(
                    Object.entries(scores[p.id])
                        .filter(([, v]) => v !== null)
                        .map(([h, v]) => [Number(h), v as number])
                )
            ])
        )
        navigate('/new-game/auto', { state: { scores: autoScores } })
    }

    async function handleRatta() {
        const hasEmpty = selectedPlayers.some(p =>
            activeHoles.some(h => scores[p.id][h] === null)
        )
        if (hasEmpty) {
            setShowWarning(true)
        } else {
            await submitToBackend(scores)
            navigate('/new-game/animation', { state: { scores } })
        }
    }

    async function handleRattaAndå() {
        const filledScores = { ...scores }
        selectedPlayers.forEach(p => {
            activeHoles.forEach(h => {
                if (filledScores[p.id][h] === null) filledScores[p.id][h] = 7
            })
        })
        await submitToBackend(filledScores)
        navigate('/new-game/animation', { state: { scores: filledScores } })
    }

    function handlePlockaHål() {
        const unplayed = activeHoles.filter(h =>
            selectedPlayers.every(p => scores[p.id][h] === null)
        )
        setActiveHoles(prev => prev.filter(h => !unplayed.includes(h)))
        setShowWarning(false)
    }

    async function submitToBackend(finalScores: Record<string, Record<number, number | null>>) {
        if (!token || !gameId) return
        const scoreList = selectedPlayers.flatMap(p =>
            activeHoles
                .filter(h => finalScores[p.id][h] !== null)
                .map(h => ({
                    gamePlayerId: gamePlayerMap[p.id],
                    holeNumber: h,
                    strokes: finalScores[p.id][h]!,
                }))
        )
        await submitScores(token, gameId, scoreList)
    }

    return (
        <>
            <div className={`page${activeCell ? ' page--numpad-active' : ''}`}>
                <H1>{courseName ?? 'Bana'}</H1>

                <div className="summarycard summarycard--full" style={{ padding: '15px 1px' }}>
                    <div className="scorecard-wrapper">
                        <table className="scorecard-table">
                            <thead>
                                <tr>
                                    <th className="scorecard-hole-header"></th>
                                    {selectedPlayers.map(p => (
                                        <th key={p.id} className="scorecard-player-header">
                                            <span>{displayNames.get(p.id)}</span>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {activeHoles.map(hole => (
                                    <tr key={hole} ref={el => { rowRefs.current[hole] = el }}>
                                        <td className="scorecard-hole-cell">{hole}.</td>
                                        {selectedPlayers.map(p => {
                                            const isActive = activeCell?.playerId === p.id && activeCell?.hole === hole
                                            return (
                                                <td
                                                    key={p.id}
                                                    className={`scorecard-score-cell${isActive ? ' scorecard-score-cell--active' : ''}`}
                                                    style={{ backgroundColor: hexToRgba(p.color, isActive ? 0.35 : hole % 2 !== 0 ? 0.5 : 0.3) }}
                                                    onClick={() => setActiveCell({ playerId: p.id, hole })}
                                                >
                                                    {scores[p.id][hole] ?? '-'}
                                                </td>
                                            )
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <Button onClick={() => setShowConfirm(true)}>Rätta</Button>

                <button className="ghost auto-link-btn" onClick={navigateToAuto}>
                    Byt till auto-läge
                </button>

                {showWarning && (
                    <div className="warning-overlay">
                        <div className="warning-dialog">
                            <p>Alla har inte spelat på varje hål än. Om du väljer att rätta nu kommer alla ospelade hål automatiskt få 7 poäng. Om du tog misst på antalet hål kan du välja att plocka bort de hål som är helt ospelade.</p>
                            <Button onClick={handleRattaAndå}>Rätta ändå</Button>
                            <Button onClick={handlePlockaHål}>Plocka bort hål</Button>
                            <Button onClick={() => setShowWarning(false)}>Avbryt</Button>
                        </div>
                    </div>
                )}
            </div>

            {activeCell && (
                <>
                    <div className="number-pad-backdrop" onClick={() => setActiveCell(null)} />
                    <NumberPad
                        onSelect={handleSelect}
                        onDelete={handleDelete}
                        onClose={() => setActiveCell(null)}
                    />
                </>
            )}

            {showConfirm && (
                <div className="warning-overlay">
                    <div className="warning-dialog">
                        <p>Är ni säkra på att ni vill rätta spelet?</p>
                        <Button onClick={() => { setShowConfirm(false); handleRatta() }}>Ja, rätta</Button>
                        <Button onClick={() => setShowConfirm(false)}>Avbryt</Button>
                    </div>
                </div>
            )}

            {showModeModal && (
                <div className="warning-overlay">
                    <div className="warning-dialog">
                        <p>Vill ni spela i auto-läge eller fylla i era poäng manuellt?</p>
                        <button className="auto-modal-btn" style={{ backgroundColor: 'var(--button-color, #45AC7F)' }} onClick={navigateToAuto}>Auto</button>
                        <button className="auto-modal-btn" style={{ backgroundColor: 'var(--button-color, #45AC7F)' }} onClick={() => setShowModeModal(false)}>Manuellt</button>
                    </div>
                </div>
            )}
        </>
    )
}

export default GameManualPage
