const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5098'

export interface FriendDto {
    friendshipId: string
    userId: string
    username: string
    avatarId: string
    topColor: string | null
}

export interface FriendRequestDto {
    friendshipId: string
    requesterId: string
    username: string
    avatarId: string
    topColor: string | null
}

function authHeaders(token: string) {
    return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
}

export async function getFriends(token: string): Promise<FriendDto[]> {
    const res = await fetch(`${BASE_URL}/api/friends`, { headers: authHeaders(token) })
    const data = await res.json()
    return data.friends ?? []
}

export async function getFriendRequests(token: string): Promise<FriendRequestDto[]> {
    const res = await fetch(`${BASE_URL}/api/friends/requests`, { headers: authHeaders(token) })
    const data = await res.json()
    return data.requests ?? []
}

export async function sendFriendRequest(token: string, addresseeId: string): Promise<boolean> {
    const res = await fetch(`${BASE_URL}/api/friends/request`, {
        method: 'POST',
        headers: authHeaders(token),
        body: JSON.stringify({ addresseeId }),
    })
    return res.ok
}

export async function acceptFriendRequest(token: string, friendshipId: string): Promise<boolean> {
    const res = await fetch(`${BASE_URL}/api/friends/${friendshipId}/accept`, {
        method: 'PUT',
        headers: authHeaders(token),
    })
    return res.ok
}

export async function removeFriend(token: string, friendshipId: string): Promise<boolean> {
    const res = await fetch(`${BASE_URL}/api/friends/${friendshipId}`, {
        method: 'DELETE',
        headers: authHeaders(token),
    })
    return res.ok
}
