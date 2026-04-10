import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { useAuth } from './AuthContext'
import { getFriendRequests } from '../api/friends'
import { getUserGames } from '../api/games'

interface NotificationContextType {
    hasFriendRequest: boolean
    hasNewGame: boolean
    markGamesSeen: () => void
}

const NotificationContext = createContext<NotificationContextType | null>(null)

const LAST_SEEN_GAMES_KEY = 'lastSeenGamesAt'
const POLL_INTERVAL_MS = 30_000

export function NotificationProvider({ children }: { children: React.ReactNode }) {
    const { token } = useAuth()
    const [hasFriendRequest, setHasFriendRequest] = useState(false)
    const [hasNewGame, setHasNewGame] = useState(false)

    const checkNotifications = useCallback(async () => {
        if (!token) return

        const [requests, games] = await Promise.all([
            getFriendRequests(token),
            getUserGames(token),
        ])

        setHasFriendRequest(requests.length > 0)

        const lastSeenStr = localStorage.getItem(LAST_SEEN_GAMES_KEY)
        if (!lastSeenStr) {
            setHasNewGame(games.length > 0)
        } else {
            const lastSeen = new Date(lastSeenStr)
            setHasNewGame(games.some(g => g.completedAt && new Date(g.completedAt) > lastSeen))
        }
    }, [token])

    useEffect(() => {
        checkNotifications()
        const interval = setInterval(checkNotifications, POLL_INTERVAL_MS)
        return () => clearInterval(interval)
    }, [checkNotifications])

    const markGamesSeen = useCallback(() => {
        localStorage.setItem(LAST_SEEN_GAMES_KEY, new Date().toISOString())
        setHasNewGame(false)
    }, [])

    return (
        <NotificationContext.Provider value={{ hasFriendRequest, hasNewGame, markGamesSeen }}>
            {children}
        </NotificationContext.Provider>
    )
}

export function useNotifications() {
    const context = useContext(NotificationContext)
    if (!context) throw new Error('useNotifications must be used inside NotificationProvider')
    return context
}
