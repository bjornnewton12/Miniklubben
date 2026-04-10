import { useState, useEffect, useMemo, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useNewGame } from '../context/NewGameContext'
import { getDisplayNames } from '../utils/getDisplayNames'

const ROW_HEIGHT = 56
const HOLE_DURATION = 500

function easeInOut(t: number): number {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
}

function AnimationResultsPage() {
    const { players, courseName } = useNewGame()
    const { state } = useLocation()
    const navigate = useNavigate()
    const scores: Record<string, Record<number, number>> = state?.scores ?? {}
    const displayNames = getDisplayNames(players)

    const activeHoles = useMemo(() => {
        const all = new Set<number>()
        players.forEach(p => Object.keys(scores[p.id] ?? {}).forEach(h => all.add(Number(h))))
        return Array.from(all).sort((a, b) => a - b)
    }, [players, scores])

    const cumulativeByHole = useMemo(() =>
        activeHoles.map((_, idx) =>
            Object.fromEntries(players.map(p => [
                p.id,
                activeHoles.slice(0, idx + 1).reduce((sum, h) => sum + (scores[p.id]?.[h] ?? 0), 0)
            ]))
        ), [activeHoles, players, scores])

    const finalTotals = cumulativeByHole[cumulativeByHole.length - 1] ?? {}
    const maxFinalScore = Math.max(...Object.values(finalTotals), 1)

    // Refs for direct DOM updates — bars and score text never go through React
    const barRefs = useRef<Record<string, HTMLDivElement | null>>({})
    const scoreRefs = useRef<Record<string, HTMLSpanElement | null>>({})
    const sortOrderRef = useRef<string[]>(players.map(p => p.id))

    // React state only drives the row positions (translateY) — updated only on rank change
    const [positionMap, setPositionMap] = useState<Record<string, number>>(
        Object.fromEntries(players.map((p, i) => [p.id, i]))
    )
    const [holeIndex, setHoleIndex] = useState(0)
    const [done, setDone] = useState(false)
    const rafRef = useRef<number | null>(null)

    function getSortedOrder(currentScores: Record<string, number>): string[] {
        return [...players]
            .sort((a, b) => {
                const diff = (currentScores[a.id] ?? 0) - (currentScores[b.id] ?? 0)
                return diff !== 0 ? diff : a.id.localeCompare(b.id)
            })
            .map(p => p.id)
    }

    useEffect(() => {
        if (holeIndex >= activeHoles.length) {
            players.forEach(p => {
                const score = finalTotals[p.id] ?? 0
                if (barRefs.current[p.id]) barRefs.current[p.id]!.style.width = `${(score / maxFinalScore) * 100}%`
                if (scoreRefs.current[p.id]) scoreRefs.current[p.id]!.textContent = `${score}p`
            })
            const finalOrder = getSortedOrder(finalTotals)
            sortOrderRef.current = finalOrder
            setPositionMap(Object.fromEntries(finalOrder.map((id, i) => [id, i])))
            setDone(true)
            return
        }

        const prevScores = holeIndex === 0
            ? Object.fromEntries(players.map(p => [p.id, 0]))
            : cumulativeByHole[holeIndex - 1]
        const targetScores = cumulativeByHole[holeIndex]
        const start = performance.now()

        function tick(now: number) {
            const progress = Math.min((now - start) / HOLE_DURATION, 1)
            const eased = easeInOut(progress)

            const currentScores: Record<string, number> = {}
            players.forEach(p => {
                const score = Math.round(prevScores[p.id] + (targetScores[p.id] - prevScores[p.id]) * eased)
                currentScores[p.id] = score
                // Direct DOM — no layout reflow through React
                if (barRefs.current[p.id]) barRefs.current[p.id]!.style.width = `${(score / maxFinalScore) * 100}%`
                if (scoreRefs.current[p.id]) scoreRefs.current[p.id]!.textContent = `${score}p`
            })

            // Only trigger a React re-render when the ranking order actually changes
            const newOrder = getSortedOrder(currentScores)
            if (newOrder.some((id, i) => id !== sortOrderRef.current[i])) {
                sortOrderRef.current = newOrder
                setPositionMap(Object.fromEntries(newOrder.map((id, i) => [id, i])))
            }

            if (progress < 1) {
                rafRef.current = requestAnimationFrame(tick)
            } else {
                setHoleIndex(i => i + 1)
            }
        }

        rafRef.current = requestAnimationFrame(tick)
        return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
    }, [holeIndex])

    function goToResults() {
        if (rafRef.current) cancelAnimationFrame(rafRef.current)
        navigate('/new-game/results', { state: { scores } })
    }

    return (
        <div className="page">
            <div className="h3">Resultat</div>
            <div className="h1">{courseName ?? 'Bana'}</div>
            <div className="card card--full animation-card">
                <div className="animation-rows" style={{ height: players.length * ROW_HEIGHT }}>
                    {players.map(p => (
                        <div
                            key={p.id}
                            className="animation-row"
                            style={{ transform: `translateY(${(positionMap[p.id] ?? 0) * ROW_HEIGHT}px)` }}
                        >
                            <span className="animation-name">{displayNames.get(p.id)}</span>
                            <div className="animation-bar-track">
                                <div
                                    ref={el => { barRefs.current[p.id] = el }}
                                    className="animation-bar"
                                    style={{ backgroundColor: p.color }}
                                />
                            </div>
                            <span
                                ref={el => { scoreRefs.current[p.id] = el }}
                                className="animation-score"
                            >0p</span>
                        </div>
                    ))}
                </div>
            </div>
            <button className="ghost" onClick={goToResults}>
                {done ? 'Visa resultat' : 'Hoppa över'}
            </button>
        </div>
    )
}

export default AnimationResultsPage
