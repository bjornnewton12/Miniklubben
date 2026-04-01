const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5098'

interface AuthResponse {
    success: boolean
    user: {
        id: string
        username: string
        avatarId: string
        topColor: string
        colorRankings: Array<{ id: string; name: string; hexValue: string }>
    } | null
    token: string | null
    error: string | null
}

export async function login(
    username: string, 
    password: string
    ): Promise<AuthResponse> {
    const res = await fetch(`${BASE_URL}/api/auth/login`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        })
    return res.json()
}

export async function register(
    username: string,
    password: string,
    avatarId: string,
    colorRankingIds: string[]
    ): Promise<AuthResponse> {
    const res = await fetch(`${BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, avatarId, colorRankingIds }),
    })
    if (!res.ok) {
        const error = await res.text()
        return { success: false, user: null, token: null, error }
    }
    return res.json()
}

export async function checkUsername(username: string): Promise<boolean> {
    const res = await fetch(`${BASE_URL}/api/auth/check-username/${username}`)
    const data = await res.json()
    return data.exists
}