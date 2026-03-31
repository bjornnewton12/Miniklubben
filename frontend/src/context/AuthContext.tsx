import { createContext, useContext, useState } from 'react'

interface AuthState {
    token: string | null
    username: string | null
    userId: string | null
    avatarId: string | null
    topColor: string | null
}

interface AuthContextType extends AuthState {
    login: (token: string, username: string, userId: string, avatarId: string, topColor: string) => void
    logout: () => void
    updateAvatar: (avatarId: string, topColor: string) => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [auth, setAuth] = useState<AuthState>({
        token: localStorage.getItem('token'),
        username: localStorage.getItem('username'),
        userId: localStorage.getItem('userId'),
        avatarId: localStorage.getItem('avatarId'),
        topColor: localStorage.getItem('topColor'),
    })

    function login(token: string, username: string, userId: string, avatarId: string, topColor: string) {
        localStorage.setItem('token', token)
        localStorage.setItem('username', username)
        localStorage.setItem('userId', userId)
        localStorage.setItem('avatarId', avatarId)
        localStorage.setItem('topColor', topColor)
        setAuth({ token, username, userId, avatarId, topColor })
    }

    function logout() {
        localStorage.removeItem('token')
        localStorage.removeItem('username')
        localStorage.removeItem('userId')
        localStorage.removeItem('avatarId')
        localStorage.removeItem('topColor')
        setAuth({ token: null, username: null, userId: null, avatarId: null, topColor: null })
    }

    function updateAvatar(avatarId: string, topColor: string) {
        localStorage.setItem('avatarId', avatarId)
        localStorage.setItem('topColor', topColor)
        setAuth(prev => ({ ...prev, avatarId, topColor }))
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