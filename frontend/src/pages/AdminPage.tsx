import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { getCourses, type CourseDto } from '../api/courses'
import {
    adminGetUsers, adminDeleteUser,
    adminGetGames, adminDeleteGame,
    adminDeleteCourse, adminRenameCourse,
    type AdminUserDto, type AdminGameDto
} from '../api/admin'
import { AVATARS } from '../constants/avatars'

type Tab = 'banor' | 'spel' | 'användare'

function AdminPage() {
    const { token } = useAuth()
    const [tab, setTab] = useState<Tab>('banor')

    const [courses, setCourses] = useState<CourseDto[]>([])
    const [games, setGames] = useState<AdminGameDto[]>([])
    const [users, setUsers] = useState<AdminUserDto[]>([])

    const [renamingId, setRenamingId] = useState<string | null>(null)
    const [renameValue, setRenameValue] = useState('')
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

    useEffect(() => {
        if (!token) return
        if (tab === 'banor') getCourses().then(setCourses)
        if (tab === 'spel') adminGetGames(token).then(setGames)
        if (tab === 'användare') adminGetUsers(token).then(setUsers)
    }, [tab, token])

    async function handleRenameConfirm(courseId: string) {
        if (!token || !renameValue.trim()) return
        const ok = await adminRenameCourse(token, courseId, renameValue.trim())
        if (ok) {
            setCourses(prev => prev.map(c => c.id === courseId ? { ...c, name: renameValue.trim() } : c))
            setRenamingId(null)
            setRenameValue('')
        }
    }

    async function handleDeleteCourse(courseId: string) {
        if (!token) return
        const ok = await adminDeleteCourse(token, courseId)
        if (ok) {
            setCourses(prev => prev.filter(c => c.id !== courseId))
            setConfirmDeleteId(null)
        }
    }

    async function handleDeleteGame(gameId: string) {
        if (!token) return
        const ok = await adminDeleteGame(token, gameId)
        if (ok) {
            setGames(prev => prev.filter(g => g.id !== gameId))
            setConfirmDeleteId(null)
        }
    }

    async function handleDeleteUser(userId: string) {
        if (!token) return
        const ok = await adminDeleteUser(token, userId)
        if (ok) {
            setUsers(prev => prev.filter(u => u.id !== userId))
            setConfirmDeleteId(null)
        }
    }

    function formatDate(iso: string | null) {
        if (!iso) return '–'
        return new Date(iso).toLocaleDateString('sv-SE')
    }

    return (
        <div className="page">
            <div className="h1">Admin</div>

            <div className="admin-tabs">
                {(['banor', 'spel', 'användare'] as Tab[]).map(t => (
                    <button
                        key={t}
                        className={`admin-tab${tab === t ? ' admin-tab--active' : ''}`}
                        onClick={() => { setTab(t); setConfirmDeleteId(null); setRenamingId(null) }}
                    >
                        {t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                ))}
            </div>

            {tab === 'banor' && (
                <div className="card card--full">
                    {courses.length === 0 && <div className="admin-empty">Inga banor</div>}
                    {courses.map(c => (
                        <div key={c.id} className="admin-row">
                            {renamingId === c.id ? (
                                <div className="admin-rename">
                                    <input
                                        className="admin-input"
                                        value={renameValue}
                                        onChange={e => setRenameValue(e.target.value)}
                                        autoFocus
                                    />
                                    <button className="admin-btn admin-btn--confirm" onClick={() => handleRenameConfirm(c.id)}>Spara</button>
                                    <button className="admin-btn admin-btn--cancel" onClick={() => { setRenamingId(null); setRenameValue('') }}>Avbryt</button>
                                </div>
                            ) : confirmDeleteId === c.id ? (
                                <div className="admin-confirm">
                                    <span className="admin-confirm-text">Ta bort "{c.name}"?</span>
                                    <button className="admin-btn admin-btn--danger" onClick={() => handleDeleteCourse(c.id)}>Ja, ta bort</button>
                                    <button className="admin-btn admin-btn--cancel" onClick={() => setConfirmDeleteId(null)}>Avbryt</button>
                                </div>
                            ) : (
                                <>
                                    <span className="admin-row-label">{c.name}</span>
                                    <div className="admin-row-actions">
                                        <button className="admin-btn admin-btn--secondary" onClick={() => { setRenamingId(c.id); setRenameValue(c.name) }}>Byt namn</button>
                                        <button className="admin-btn admin-btn--danger" onClick={() => setConfirmDeleteId(c.id)}>Ta bort</button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {tab === 'spel' && (
                <div className="card card--full">
                    {games.length === 0 && <div className="admin-empty">Inga spel</div>}
                    {games.map(g => (
                        <div key={g.id} className="admin-row">
                            {confirmDeleteId === g.id ? (
                                <div className="admin-confirm">
                                    <span className="admin-confirm-text">Ta bort detta spel?</span>
                                    <button className="admin-btn admin-btn--danger" onClick={() => handleDeleteGame(g.id)}>Ja, ta bort</button>
                                    <button className="admin-btn admin-btn--cancel" onClick={() => setConfirmDeleteId(null)}>Avbryt</button>
                                </div>
                            ) : (
                                <>
                                    <div className="admin-row-info">
                                        <span className="admin-row-label">{g.courseName}</span>
                                        <span className="admin-row-sub">{formatDate(g.completedAt)} · {g.playerNames.join(', ')}</span>
                                    </div>
                                    <button className="admin-btn admin-btn--danger" onClick={() => setConfirmDeleteId(g.id)}>Ta bort</button>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {tab === 'användare' && (
                <div className="card card--full">
                    {users.length === 0 && <div className="admin-empty">Inga användare</div>}
                    {users.map(u => {
                        const av = AVATARS.find(a => a.id === u.avatarId)
                        return (
                            <div key={u.id} className="admin-row">
                                {confirmDeleteId === u.id ? (
                                    <div className="admin-confirm">
                                        <span className="admin-confirm-text">Ta bort {u.firstName} {u.surname}? Deras spelhistorik bevaras.</span>
                                        <button className="admin-btn admin-btn--danger" onClick={() => handleDeleteUser(u.id)}>Ja, ta bort</button>
                                        <button className="admin-btn admin-btn--cancel" onClick={() => setConfirmDeleteId(null)}>Avbryt</button>
                                    </div>
                                ) : (
                                    <>
                                        <div className="admin-user-info">
                                            <div className="admin-avatar">
                                                {av && <img src={av.src} alt="" />}
                                            </div>
                                            <div className="admin-row-info">
                                                <span className="admin-row-label">{u.firstName} {u.surname}</span>
                                                <span className="admin-row-sub">@{u.username}</span>
                                            </div>
                                        </div>
                                        <button className="admin-btn admin-btn--danger" onClick={() => setConfirmDeleteId(u.id)}>Ta bort</button>
                                    </>
                                )}
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

export default AdminPage
