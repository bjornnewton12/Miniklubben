import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { H1, H2 } from '../components/typography/Typography'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import { useNewGame } from '../context/NewGameContext'
import { useAuth } from '../context/AuthContext'
import { getCourses, createCourse, type CourseDto } from '../api/courses'
import { getUserGames } from '../api/games'
import { LOCATIONS } from '../constants/locations'


function CoursePage() {
    const { courseId, setCourseId, setCourseName, setCourseImageUrl, setHoles } = useNewGame()
    const { token } = useAuth()
    const [newCourseName, setNewCourseName] = useState('')
    const [newCourseLocation, setNewCourseLocation] = useState(LOCATIONS[0])
    const [newCourseHoles, setNewCourseHoles] = useState('')
    const [courses, setCourses] = useState<CourseDto[]>([])
    const [locationOrder, setLocationOrder] = useState<string[]>([])
    const [expandedLocations, setExpandedLocations] = useState<Set<string>>(new Set())
    const [addCourseExpanded, setAddCourseExpanded] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchData = async () => {
            const [fetched, games] = await Promise.all([
                getCourses(),
                token ? getUserGames(token) : Promise.resolve([]),
            ])
            setCourses(fetched)

            // Build location order: sort by most recently played, unplayed locations appended after
            const seenLocations = new Map<string, string>()
            for (const game of games) {
                if (!seenLocations.has(game.courseLocation)) {
                    seenLocations.set(game.courseLocation, game.completedAt ?? '')
                }
            }
            const playedLocs = [...seenLocations.entries()]
                .sort((a, b) => b[1].localeCompare(a[1]))
                .map(([loc]) => loc)
            const unplayedLocs = LOCATIONS.filter(loc =>
                fetched.some(c => c.location === loc) && !seenLocations.has(loc)
            )
            setLocationOrder([...playedLocs, ...unplayedLocs])
        }
        fetchData()
    }, [])

    async function addCourse() {
        const holes = parseInt(newCourseHoles)
        if (newCourseName.trim() === '' || !token || !holes || holes < 1) return
        const created = await createCourse(token, newCourseName.trim(), newCourseLocation, holes)
        if (!created) return
        setCourses(prev => [created, ...prev])
        setCourseId(created.id)
        setCourseName(created.name)
        setCourseImageUrl(created.imageUrl)
        setHoles(created.minHoles)
        setNewCourseName('')
        setNewCourseHoles('')
        setExpandedLocations(prev => new Set([...prev, created.location]))
    }

    function selectCourse(id: string, name: string, imageUrl: string | null, holes: number) {
        setCourseId(id)
        setCourseName(name)
        setCourseImageUrl(imageUrl)
        setHoles(holes)
    }

    function toggleLocation(loc: string) {
        setExpandedLocations(prev => {
            const next = new Set(prev)
            if (next.has(loc)) next.delete(loc)
            else next.add(loc)
            return next
        })
    }

    const grouped = locationOrder
        .map(loc => ({ location: loc, courses: courses.filter(c => c.location === loc) }))
        .filter(g => g.courses.length > 0)

    return (
        <div className="page">
            <H1>Nytt spel</H1>
            <Card className="card--full">
                <button className="ghost back-button" onClick={() => navigate(-1)}>{'< Tillbaka'}</button>
                <H2>Välj bland banor</H2>

                {grouped.map(({ location, courses: locationCourses }) => {
                    const expanded = expandedLocations.has(location)
                    return (
                        <div key={location} className="location-section">
                            <button className="location-header" onClick={() => toggleLocation(location)}>
                                <span className="h3">{location}</span>
                                <span>{expanded ? '∨' : '>'}</span>
                            </button>
                            {expanded && (
                                <div className="course-grid">
                                    {locationCourses.map(course => (
                                        <div key={course.id} className="course-item" onClick={() => selectCourse(course.id, course.name, course.imageUrl, course.minHoles)}>
                                            <div className="course-thumbnail" style={{
                                                outline: courseId === course.id ? '3px solid white' : '3px solid transparent',
                                                outlineOffset: '2px',
                                            }}>
                                                {course.imageUrl && <img src={course.imageUrl} alt={course.name} />}
                                            </div>
                                            <span className="label">{course.name}</span>
                                            <span className="label">{course.minHoles} hål</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )
                })}

                <div className="location-section">
                    <button className="location-header" onClick={() => setAddCourseExpanded(prev => !prev)}>
                        <span className="h3">Lägg till ny bana</span>
                        <span>{addCourseExpanded ? '∨' : '>'}</span>
                    </button>
                    {addCourseExpanded && (
                        <div className="add-course-form">
                            <input
                                placeholder="Skriv namnet på banan"
                                value={newCourseName}
                                onChange={e => setNewCourseName(e.target.value)}
                            />
                            <select value={newCourseLocation} onChange={e => setNewCourseLocation(e.target.value)}>
                                {LOCATIONS.map(loc => (
                                    <option key={loc} value={loc}>{loc}</option>
                                ))}
                            </select>
                            <input
                                placeholder="Hur många hål?"
                                type="number"
                                min="1"
                                value={newCourseHoles}
                                onChange={e => setNewCourseHoles(e.target.value)}
                            />
                            <Button disabled={newCourseName.trim() === '' || !newCourseHoles} onClick={addCourse}>Lägg till</Button>
                        </div>
                    )}
                </div>
            </Card>

            <Button disabled={!courseId} onClick={() => navigate('/new-game/summary')}>Nästa steg</Button>
        </div>
    )
}

export default CoursePage
