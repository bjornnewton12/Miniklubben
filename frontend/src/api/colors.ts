const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5098'

export interface ApiColor {
    id: string
    name: string
    hexValue: string
}

export async function getColors(): Promise<ApiColor[]> {
    const res = await fetch(`${BASE_URL}/api/colors`)
    const data = await res.json()
    return data.colors
}