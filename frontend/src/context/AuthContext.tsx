import { createContext, useContext, useState } from 'react'

interface AuthState {
    token: string | null
    username: string | null
    userId: string | null
    avatarId: string | null
    topColor: string | null
    colorRankings: string[]
}

interface AuthContextType extends AuthState {
    login: (token: string, username: string, userId: string, avatarId: string, topColor: string, colorRankings: string[]) => void
    logout: () => void
    updateAvatar: (avatarId: string, topColor: string, colorRankings: string[]) => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [auth, setAuth] = useState<AuthState>({
        token: localStorage.getItem('token'),
        username: localStorage.getItem('username'),
        userId: localStorage.getItem('userId'),
        avatarId: localStorage.getItem('avatarId'),
        topColor: localStorage.getItem('topColor'),
        colorRankings: JSON.parse(localStorage.getItem('colorRankings') ?? '[]')
    })

    function login(token: string, username: string, userId: string, avatarId: string, topColor: string, colorRankings: string[]) {
        localStorage.setItem('token', token)
        localStorage.setItem('username', username)
        localStorage.setItem('userId', userId)
        localStorage.setItem('avatarId', avatarId)
        localStorage.setItem('topColor', topColor)
        localStorage.setItem('colorRankings', JSON.stringify(colorRankings))
        setAuth({ token, username, userId, avatarId, topColor, colorRankings })
    }

    function logout() {
        localStorage.removeItem('token')
        localStorage.removeItem('username')
        localStorage.removeItem('userId')
        localStorage.removeItem('avatarId')
        localStorage.removeItem('topColor')
        localStorage.removeItem('colorRankings')
        setAuth({ token: null, username: null, userId: null, avatarId: null, topColor: null, colorRankings: [] })
    }

    function updateAvatar(avatarId: string, topColor: string, colorRankings: string[]) {
        localStorage.setItem('avatarId', avatarId)
        localStorage.setItem('topColor', topColor)
        localStorage.setItem('colorRankings', JSON.stringify(colorRankings))
        setAuth(prev => ({ ...prev, avatarId, topColor, colorRankings }))
    }

    return (
        <AuthContext.Provider value={{ ...auth, login, updateAvatar, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) throw new Error('useAuth must be used inside AuthProvider')
    return context
}