import { createContext, useContext, useState, useEffect } from 'react'

interface AuthState {
    token: string | null
    username: string | null
    userId: string | null
}

interface AuthContextType extends AuthState {
    login: (token: string, username: string, userId: string) => void
    logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [auth, setAuth] = useState<AuthState>({
        token: localStorage.getItem('token'),
        username: localStorage.getItem('username'),
        userId: localStorage.getItem('userId'),
    })

    function login(token: string, username: string, userId: string) {
        localStorage.setItem('token', token)
        localStorage.setItem('username', username)
        localStorage.setItem('userId', userId)
        setAuth({ token, username, userId })
    }

    function logout() {
        localStorage.removeItem('token')
        localStorage.removeItem('username')
        localStorage.removeItem('userId')
        setAuth({ token: null, username: null, userId: null })
    }

    return (
        <AuthContext.Provider value={{ ...auth, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) throw new Error('useAuth must be used inside AuthProvider')
    return context
}