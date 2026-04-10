import type { Player } from '../context/NewGameContext'

/**
 * Returns a display name per player.
 * If two players share the same first name, appends enough letters of their surname to make them unique.
 * Guests (empty surname) always show just their first name.
 */
export function getDisplayNames(players: Player[]): Map<string, string> {
    const result = new Map<string, string>()

    const byFirstName = new Map<string, Player[]>()
    for (const p of players) {
        const group = byFirstName.get(p.firstName) ?? []
        group.push(p)
        byFirstName.set(p.firstName, group)
    }

    for (const [firstName, group] of byFirstName) {
        if (group.length === 1) {
            result.set(group[0].id, firstName)
            continue
        }

        for (const p of group) {
            if (!p.surname) {
                result.set(p.id, firstName)
                continue
            }

            let letters = 1
            while (letters <= p.surname.length) {
                const abbr = p.surname.slice(0, letters)
                const clash = group.some(other =>
                    other.id !== p.id &&
                    other.surname.slice(0, letters) === abbr
                )
                if (!clash) break
                letters++
            }

            result.set(p.id, `${firstName} ${p.surname.slice(0, letters)}`)
        }
    }

    return result
}
