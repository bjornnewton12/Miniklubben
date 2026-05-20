const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5098'

export interface AdminUserDto {
    id: string
    username: string
    firstName: string
    surname: string
    avatarId: string
    role: string
}

export interface AdminGameDto {
    id: string
    courseName: string
    completedAt: string | null
    playerNames: string[]
}

export async function adminGetUsers(token: string): Promise<AdminUserDto[]> {
    const res = await fetch(`${BASE_URL}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
    })
    if (!res.ok) return []
    const data = await res.json()
    return data.users ?? []
}

export async function adminDeleteUser(token: string, userId: string): Promise<boolean> {
    const res = await fetch(`${BASE_URL}/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
    })
    return res.ok
}

export async function adminGetGames(token: string): Promise<AdminGameDto[]> {
    const res = await fetch(`${BASE_URL}/api/admin/games`, {
        headers: { Authorization: `Bearer ${token}` }
    })
    if (!res.ok) return []
    const data = await res.json()
    return data.games ?? []
}

export async function adminDeleteGame(token: string, gameId: string): Promise<boolean> {
    const res = await fetch(`${BASE_URL}/api/admin/games/${gameId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
    })
    return res.ok
}

export async function adminDeleteCourse(token: string, courseId: string): Promise<boolean> {
    const res = await fetch(`${BASE_URL}/api/admin/courses/${courseId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
    })
    return res.ok
}

export async function adminRenameCourse(token: string, courseId: string, newName: string): Promise<boolean> {
    const res = await fetch(`${BASE_URL}/api/admin/courses/${courseId}/name`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ newName })
    })
    return res.ok
}
