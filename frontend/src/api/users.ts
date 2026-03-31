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
