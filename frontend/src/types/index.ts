// Auth
export interface LoginRequest {
    username: string;
    password: string;
}

export interface RegisterRequest {
    username: string;
    password: string;
    colorRankings: string[]; // ordered list of Color IDs
    avatarId: string;
}

export interface AuthResponse {
    token: string;
    username: string;
    userId: string;
}

// User
export interface User {
    id: string;
    username: string;
    avatarId: string;
    createdAt: string;
}

// Color
export interface Color {
    id: string;
    name: string;
    hexValue: string;
}

// Course
export interface Course {
    id: string;
    name: string;
    description?: string;
    imageUrl?: string;
    minHoles: number;
    maxHoles: number;
}

// Game
export type GameStatus = 'in_progress' | 'completed';

export interface Game {
    id: string;
    courseId: string;
    course: Course;
    holesPlayed: number;
    createdBy: string;
    status: GameStatus;
    createdAt: string;
    completedAt?: string;
    players: GamePlayer[];
}

// GamePlayer
export interface GamePlayer {
    id: string;
    gameId: string;
    userId?: string;
    guestName?: string;
    assignedColorId?: string;
    assignedColor?: Color;
    finalScore?: number;
    rank?: number;
    scores: Score[];
}

// Score
export interface Score {
    id: string;
    gamePlayerId: string;
    holeNumber: number;
    strokes: number;
}