const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5098'

export interface UserDto {
    id: string
    username: string
    avatarId: string
    topColor: string | null
}

export async function getUserByUsername(token: string, username: string): Promise<UserDto | null> {
    const res = await fetch(`${BASE_URL}/api/users/${username}`, {
        headers: { Authorization: `Bearer ${token}` }
    })
    if (!res.ok) return null
    const data = await res.json()
    return data.user ?? null
}

export async function updateUserProfile(token: string, firstName: string, surname: string, avatarId: string): Promise<boolean> {
    const res = await fetch(`${BASE_URL}/api/users/me/profile`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, surname, avatarId })
    })
    return res.ok
}

export async function updateColorRankings(token: string, colorIds: string[]): Promise<boolean> {
    const res = await fetch(`${BASE_URL}/api/users/me/color-rankings`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ colorIds })
    })
    return res.ok
}
