import { createContext, useContext, useState } from 'react'

export interface Player {
    id: string
    firstName: string
    surname: string
    color: string
    avatarId: string
    colorRankings: string[]
}

interface NewGameState {
    selectedIds: string[]
    guests: Player[]
    players: Player[]
    courseId: string | null
    courseName: string | null
    courseImageUrl: string | null
    holes: number | null
    gameId: string | null
    gamePlayerMap: Record<string, string>
}

interface NewGameContextType extends NewGameState {
    setSelectedIds: (ids: string[]) => void
    setGuests: (guests: Player[]) => void
    setPlayers: (players: Player[]) => void
    setCourseId: (id: string | null) => void
    setCourseName: (name: string | null) => void
    setCourseImageUrl: (url: string | null) => void
    setHoles: (holes: number | null) => void
    setGameId: (id: string | null) => void
    setGamePlayerMap: (map: Record<string, string>) => void
    reset: () => void
}

const defaultState: NewGameState = {
    selectedIds: [],
    guests: [],
    players: [],
    courseId: null,
    courseName: null,
    courseImageUrl: null,
    holes: null,
    gameId: null,
    gamePlayerMap: {},
}

const NewGameContext = createContext<NewGameContextType | null>(null)

export function NewGameProvider({ children }: { children: React.ReactNode }) {
    const [state, setState] = useState<NewGameState>(defaultState)

    function setSelectedIds(selectedIds: string[]) {
        setState(prev => ({ ...prev, selectedIds }))
    }

    function setGuests(guests: Player[]) {
        setState(prev => ({ ...prev, guests }))
    }

    function setPlayers(players: Player[]) {
        setState(prev => ({ ...prev, players }))
    }

    function setCourseId(courseId: string | null) {
        setState(prev => ({ ...prev, courseId }))
    }

    function setCourseName(courseName: string | null) {
        setState(prev => ({ ...prev, courseName }))
    }

    function setCourseImageUrl(courseImageUrl: string | null) {
        setState(prev => ({ ...prev, courseImageUrl }))
    }

    function setHoles(holes: number | null) {
        setState(prev => ({ ...prev, holes }))
    }

    function setGameId(gameId: string | null) {
        setState(prev => ({ ...prev, gameId }))
    }

    function setGamePlayerMap(gamePlayerMap: Record<string, string>) {
        setState(prev => ({ ...prev, gamePlayerMap }))
    }

    function reset() {
        setState(defaultState)
    }

    return (
        <NewGameContext.Provider value={{ ...state, setSelectedIds, setGuests, setPlayers, setCourseId, setCourseName, setCourseImageUrl, setHoles, setGameId, setGamePlayerMap, reset }}>
            {children}
        </NewGameContext.Provider>
    )
}

export function useNewGame() {
    const context = useContext(NewGameContext)
    if (!context) throw new Error('useNewGame must be used inside NewGameProvider')
    return context
}
