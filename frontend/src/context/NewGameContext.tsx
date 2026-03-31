import { createContext, useContext, useState } from 'react'

interface Guest {
    id: string
    username: string
    color: string
}

interface NewGameState {
    selectedIds: string[]
    guests: Guest[]
    courseId: string | null
    courseName: string | null
    holes: number | null
}

interface NewGameContextType extends NewGameState {
    setSelectedIds: (ids: string[]) => void
    setGuests: (guests: Guest[]) => void
    setCourseId: (id: string | null) => void
    setCourseName: (name: string | null) => void
    setHoles: (holes: number | null) => void
    reset: () => void
}

const defaultState: NewGameState = {
    selectedIds: [],
    guests: [],
    courseId: null,
    courseName: null,
    holes: null,
}

const NewGameContext = createContext<NewGameContextType | null>(null)

export function NewGameProvider({ children }: { children: React.ReactNode }) {
    const [state, setState] = useState<NewGameState>(defaultState)

    function setSelectedIds(selectedIds: string[]) {
        setState(prev => ({ ...prev, selectedIds }))
    }

    function setGuests(guests: Guest[]) {
        setState(prev => ({ ...prev, guests }))
    }

    function setCourseId(courseId: string | null) {
        setState(prev => ({ ...prev, courseId }))
    }

    function setCourseName(courseName: string | null) {
        setState(prev => ({ ...prev, courseName }))
    }

    function setHoles(holes: number | null) {
        setState(prev => ({ ...prev, holes }))
    }

    function reset() {
        setState(defaultState)
    }

    return (
        <NewGameContext.Provider value={{ ...state, setSelectedIds, setGuests, setCourseId, setCourseName, setHoles, reset }}>
            {children}
        </NewGameContext.Provider>
    )
}

export function useNewGame() {
    const context = useContext(NewGameContext)
    if (!context) throw new Error('useNewGame must be used inside NewGameProvider')
    return context
}
