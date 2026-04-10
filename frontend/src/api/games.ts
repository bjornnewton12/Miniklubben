const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5098'

function authHeaders(token: string) {
    return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
}

export interface CreatedGame {
    id: string
    players: Array<{ id: string; userId: string | null; guestName: string | null }>
}

export async function createGame(
    token: string,
    courseId: string,
    numberOfHoles: number,
    players: Array<{ userId?: string; guestName?: string }>): Promise<CreatedGame | null> {
    const res = await fetch(`${BASE_URL}/api/games`, {
        method: 'POST',
        headers: authHeaders(token),
        body: JSON.stringify({ courseId, numberOfHoles, players }),
    })
    if (!res.ok) return null
    const data = await res.json()
    return data.game ?? null
}

export async function submitScores(
    token: string,
    gameId: string,
    scores: Array<{ gamePlayerId: string; holeNumber: number; strokes: number }>): Promise<boolean> {
    const res = await fetch(`${BASE_URL}/api/games/${gameId}/scores`, {
        method: 'POST',
        headers: authHeaders(token),
        body: JSON.stringify({ scores }),
    })
    return res.ok
}

export interface UserGamePlayer {
    displayName: string
    firstName: string
    surname: string
    avatarId: string
    colorHex: string | null
    finalScore: number | null
    rank: number | null
}

export interface UserGameSummary {
    id: string
    courseName: string
    courseLocation: string
    courseImageUrl: string | null
    completedAt: string | null
    players: UserGamePlayer[]
}

export async function getUserGames(token: string): Promise<UserGameSummary[]> {
    const res = await fetch(`${BASE_URL}/api/games`, {
        headers: authHeaders(token),
    })
    if (!res.ok) return []
    const data = await res.json()
    return data.games ?? []
}
