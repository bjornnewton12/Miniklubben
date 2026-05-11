import { COLORS } from '../constants/colors'

export function assignColors(players: Array<{
    id: string;
    colorRankings: string[]
}>): Map<string, string> {
    const assigned = new Map<string, string>()
    const taken = new Set<string>()

    const registered = players.filter(p => !p.id.startsWith('guest-'))
    const guests = players.filter(p => p.id.startsWith('guest-'))
    const state = registered.map(p => ({ id: p.id, colorRankings: p.colorRankings, idx: 0 }))

    let limit = COLORS.length * 2
    while (state.some(p => !assigned.has(p.id)) && limit-- > 0) {
        const unassigned = state.filter(p => !assigned.has(p.id))

        for (const p of unassigned) {
            while (p.idx < p.colorRankings.length && taken.has(p.colorRankings[p.idx])) p.idx++
        }

        const stuck = unassigned.filter(p => p.idx >= p.colorRankings.length)
        const active = unassigned.filter(p => p.idx < p.colorRankings.length)

        const groups = new Map<string, typeof active>()
        for (const p of active) {
            const pref = p.colorRankings[p.idx]
            if (!groups.has(pref)) groups.set(pref, [])
            groups.get(pref)!.push(p)
        }

        for (const [hex, group] of groups) {
            if (group.length === 1) {
                assigned.set(group[0].id, hex)
                taken.add(hex)
            } else {
                const winnerIdx = Math.floor(Math.random() * group.length)
                assigned.set(group[winnerIdx].id, hex)
                taken.add(hex)
                for (let i = 0; i < group.length; i++) {
                    if (i !== winnerIdx) group[i].idx++
                }
            }
        }

        // Fallback for players who exhausted all preferences
        const remaining = COLORS.map(c => c.hex).filter(h => !taken.has(h))
        for (const p of stuck) {
            if (remaining.length > 0) {
                const color = remaining.shift()!
                assigned.set(p.id, color)
                taken.add(color)
            }
        }
    }

    const GUEST_COLOR_RANKING = ['#F5C400', '#00C8E0', '#39D353', '#F675C2', '#FF5B49', '#B050FF']
    const guestPool = GUEST_COLOR_RANKING.filter(h => !taken.has(h))
    guests.forEach((g, i) => {
        assigned.set(g.id, guestPool[i] ?? '#6b6b6b')
    })

    return assigned
}