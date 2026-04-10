const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5098'

export interface CourseDto {
    id: string
    name: string
    description: string | null
    location: string
    imageUrl: string | null
    minHoles: number
    maxHoles: number
}

export async function getCourses(): Promise<CourseDto[]> {
    const res = await fetch(`${BASE_URL}/api/courses`)
    if (!res.ok) return []
    const data = await res.json()
    return data.courses ?? []
}

export async function createCourse(token: string, name: string, location: string, numberOfHoles: number): Promise<CourseDto | null> {
    const res = await fetch(`${BASE_URL}/api/courses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name, location, numberOfHoles }),
    })
    if (!res.ok) return null
    const data = await res.json()
    return data.course ?? null
}