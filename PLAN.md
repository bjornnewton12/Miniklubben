# Minigolf Scorecard App — Project Plan

## Tech Stack
- **Frontend:** React + TypeScript (Vite), deployed to Vercel
- **Backend:** ASP.NET Core Web API (C#), deployed to Railway or Render
- **Database:** PostgreSQL via Supabase
- **Auth:** JWT-based (BCrypt for password hashing)
- **Architecture:** Clean Architecture (Domain → Application → Infrastructure → WebApi)
- **Structure:** Monorepo — /frontend and /backend in one git repo

---

## Folder Structure

```
/Minigolf
├── Minigolf.sln
├── .gitignore
├── PLAN.md
│
├── /backend
│   ├── /Minigolf.Domain                  ← Entities only, no dependencies
│   │   └── /Models
│   │       ├── User.cs
│   │       ├── Friendship.cs
│   │       ├── Course.cs
│   │       ├── CourseHole.cs
│   │       ├── Game.cs
│   │       ├── GamePlayer.cs
│   │       └── Score.cs
│   │
│   ├── /Minigolf.Application             ← Business logic, depends on Domain only
│   │   ├── /DTOs
│   │   │   ├── UserDto.cs
│   │   │   └── AuthResponse.cs
│   │   ├── /Interfaces
│   │   │   ├── IUserRepository.cs
│   │   │   └── IJwtService.cs
│   │   └── /UseCases
│   │       └── /Auth
│   │           ├── /RegisterUser
│   │           │   ├── RegisterUserCommand.cs
│   │           │   ├── RegisterUserHandler.cs
│   │           │   └── RegisterUserResult.cs
│   │           └── /LoginUser
│   │               ├── LoginUserCommand.cs
│   │               ├── LoginUserHandler.cs
│   │               └── LoginUserResult.cs
│   │
│   ├── /Minigolf.Infrastructure          ← EF Core, JWT, repos — depends on Application
│   │   ├── /Data
│   │   │   └── AppDbContext.cs
│   │   ├── /Persistance
│   │   │   ├── /Repositories
│   │   │   │   └── UserRepository.cs
│   │   │   ├── /Configurations
│   │   │   └── /Migrations
│   │   └── /Services
│   │       ├── JwtService.cs
│   │       └── UserService.cs
│   │
│   └── /Minigolf.WebApi                  ← HTTP layer only, depends on Application
│       ├── Program.cs
│       ├── appsettings.json
│       ├── appsettings.Development.json
│       ├── /Controllers
│       │   ├── AuthController.cs
│       │   ├── UsersController.cs
│       │   ├── FriendsController.cs
│       │   ├── CoursesController.cs
│       │   └── GamesController.cs
│       ├── /DTOs                         ← Request/response models (WebApi-specific)
│       ├── /Middleware
│       └── /Identity
│
└── /frontend
    ├── package.json
    ├── tsconfig.json
    ├── vite.config.ts
    └── /src
        ├── main.tsx
        ├── App.tsx
        ├── /types
        ├── /services
        │   ├── api.ts
        │   ├── authService.ts
        │   ├── userService.ts
        │   ├── friendService.ts
        │   ├── courseService.ts
        │   └── gameService.ts
        ├── /store
        │   ├── authStore.ts
        │   └── gameStore.ts
        ├── /hooks
        │   ├── useAuth.ts
        │   └── useGame.ts
        ├── /components
        │   ├── /common
        │   │   ├── Button.tsx
        │   │   ├── Input.tsx
        │   │   ├── AvatarDisplay.tsx
        │   │   ├── AvatarPicker.tsx
        │   │   ├── LoadingSpinner.tsx
        │   │   └── ErrorMessage.tsx
        │   ├── /layout
        │   │   ├── AppLayout.tsx
        │   │   ├── Header.tsx
        │   │   └── BottomNav.tsx
        │   ├── /friends
        │   │   ├── FriendsList.tsx
        │   │   ├── FriendCard.tsx
        │   │   └── AddFriendModal.tsx
        │   └── /game
        │       ├── PlayerChip.tsx
        │       ├── CourseCard.tsx
        │       ├── ScorecardRow.tsx
        │       └── LeaderboardRow.tsx
        └── /pages
            ├── LoginPage.tsx
            ├── RegisterPage.tsx
            ├── ProfilePage.tsx
            ├── /NewGame
            │   ├── NewGamePage.tsx
            │   ├── Step1Players.tsx
            │   ├── Step2Course.tsx
            │   ├── Step3Holes.tsx
            │   ├── Step4Summary.tsx
            │   ├── Step5Scorecard.tsx
            │   └── Step6Results.tsx
            └── GameHistoryPage.tsx  ← future
```

---

## Database Schema

### users
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | PK |
| username | VARCHAR(50) | UNIQUE, NOT NULL |
| password_hash | TEXT | NOT NULL |
| avatar_id | VARCHAR(50) | e.g. "avatar_01" |
| created_at | TIMESTAMPTZ | DEFAULT NOW() |

### friendships
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | PK |
| requester_id | UUID | FK → users.id |
| addressee_id | UUID | FK → users.id |
| status | ENUM | 'pending' or 'accepted' |
| created_at | TIMESTAMPTZ | |

### courses
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | PK |
| name | VARCHAR(100) | NOT NULL |
| description | TEXT | |
| image_url | TEXT | |
| min_holes | INT | NOT NULL |
| max_holes | INT | NOT NULL |

### course_holes
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | PK |
| course_id | UUID | FK → courses.id |
| hole_number | INT | NOT NULL |
| par | INT | NOT NULL |

### games
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | PK |
| course_id | UUID | FK → courses.id |
| holes_played | INT | NOT NULL |
| created_by | UUID | FK → users.id |
| status | ENUM | 'in_progress' or 'completed' |
| created_at | TIMESTAMPTZ | |
| completed_at | TIMESTAMPTZ | NULLABLE |

### game_players
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | PK |
| game_id | UUID | FK → games.id |
| user_id | UUID | FK → users.id, NULLABLE (null = guest) |
| guest_name | VARCHAR(50) | NULLABLE |
| final_score | INT | NULLABLE |
| rank | INT | NULLABLE |

### scores
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | PK |
| game_player_id | UUID | FK → game_players.id |
| hole_number | INT | NOT NULL |
| strokes | INT | NOT NULL |

---

## REST API Endpoints

### Auth
| Method | Route | Purpose |
|--------|-------|---------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Login, returns JWT |

### Users
| Method | Route | Purpose |
|--------|-------|---------|
| GET | `/api/users/me` | Get current user profile |
| GET | `/api/users/{username}` | Look up user by username |

### Friends
| Method | Route | Purpose |
|--------|-------|---------|
| GET | `/api/friends` | List accepted friends |
| POST | `/api/friends/request` | Send friend request |
| PUT | `/api/friends/{id}/accept` | Accept friend request |
| DELETE | `/api/friends/{id}` | Remove or decline friendship |

### Courses
| Method | Route | Purpose |
|--------|-------|---------|
| GET | `/api/courses` | List all courses |
| GET | `/api/courses/{id}` | Get course detail + holes |

### Games
| Method | Route | Purpose |
|--------|-------|---------|
| POST | `/api/games` | Create a new game |
| GET | `/api/games/{id}` | Get game state |
| POST | `/api/games/{id}/scores` | Submit all scores |
| GET | `/api/games/{id}/results` | Get ranked results |
| GET | `/api/users/me/games` | Game history *(future)* |

---

## React Pages & Components

| Page | Key Components | Feature |
|------|---------------|---------|
| `LoginPage` | Input, Button, ErrorMessage | Login |
| `RegisterPage` | Input, Button, AvatarPicker | Register |
| `ProfilePage` | AvatarDisplay, FriendsList, AddFriendModal | Profile + Friends |
| `NewGame → Step1Players` | FriendCard, PlayerChip | Select players |
| `NewGame → Step2Course` | CourseCard | Choose course |
| `NewGame → Step3Holes` | Number selector | Select holes |
| `NewGame → Step4Summary` | PlayerChip, CourseCard | Confirm selection |
| `NewGame → Step5Scorecard` | ScorecardRow | Enter scores |
| `NewGame → Step6Results` | LeaderboardRow | View rankings |
| `GameHistoryPage` | *(future)* | Past games |

---

## Build Order

- [x] 1. Monorepo setup (git, .gitignore, solution + 4 projects)
- [x] 2. Domain layer: entity models
- [x] 3. Application layer: interfaces, DTOs, use case handlers (Register, Login)
- [x] 4. Infrastructure layer: AppDbContext (EF Core + Npgsql), UserRepository, JwtService
- [x] 5. WebApi: Program.cs with DI wired up (services, handlers, JWT middleware)
- [x] 6. Backend: AuthController (POST /api/auth/register, POST /api/auth/login)
- [x] 7. Supabase: create project + provision PostgreSQL + run EF Core migrations
- [x] 8. Backend: UsersController (GET /api/users/me, GET /api/users/{username})
- [x] 9. Backend: FriendsController + friend request use cases
- [x] 10. Backend: CoursesController + seed data
- [ ] 11. Backend: GamesController (create, scores, results)
- [ ] 12. Frontend: Vite scaffold + routing + axios + auth store
- [ ] 13. Frontend: Login + Register pages (first full end-to-end feature)
- [ ] 14. Frontend: Profile page + Friends UI
- [ ] 15. Frontend: New Game multi-step flow (Steps 1–6)
- [ ] 16. Deploy: Vercel (frontend) + Railway/Render (backend)
- [ ] 17. *(Future)* Game History page + endpoint
