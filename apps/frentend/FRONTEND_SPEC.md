# 🚀 Complete Next.js Frontend Implementation Architecture & Blueprint

This document defines the complete technical blueprint, component hierarchy, data models, state management, API integration layer, and user flow specifications required to build the Next.js Frontend (`apps/frentend`) for the Trello Workspace Application.

---

## 🛠️ 1. Technology Stack & Architectural Core

| Layer | Recommended Technology | Purpose & Responsibility |
| :--- | :--- | :--- |
| **Framework** | Next.js 16 (App Router) | Server/Client rendering, file-based routing, SEO, edge middleware. |
| **Language** | TypeScript 5 | Strict static typing matching backend Prisma models & Zod schemas. |
| **Styling & UI** | Tailwind CSS 4 + Lucide Icons | Responsive layout, modern dark/light mode UI tokens, glassmorphism. |
| **Server State / Cache** | TanStack Query v5 (`@tanstack/react-query`) | API caching, query invalidation, background refetching, optimistic UI updates. |
| **Client State & Auth** | React Context + HTTP Cookies | Global session state, auth user profile, active organization state. |
| **Drag & Drop** | `@hello-pangea/dnd` or `@dnd-kit/core` | Kanban column and card smooth drag-and-drop interactions. |
| **Form Validation** | React Hook Form + Zod | Client-side form state and validation schemas mirroring backend Zod rules. |
| **Toast Notifications** | `sonner` or `react-hot-toast` | Real-time feedback for API actions, errors, and background syncs. |

---

## 📁 2. Next.js App Router File & Folder Structure

```text
apps/frentend/
├── src/
│   ├── app/
│   │   ├── (auth)/                       # Unauthenticated Route Group
│   │   │   ├── login/
│   │   │   │   └── page.tsx              # Sign In Form Page
│   │   │   ├── signup/
│   │   │   │   └── page.tsx              # Sign Up Form Page
│   │   │   └── layout.tsx                # Centered Glassmorphism Auth Card Layout
│   │   │
│   │   ├── (dashboard)/                  # Authenticated Dashboard Route Group
│   │   │   ├── organizations/
│   │   │   │   ├── page.tsx              # Org Directory Grid Page
│   │   │   │   └── [orgId]/
│   │   │   │       └── page.tsx          # Org Team Roster & Settings Page
│   │   │   ├── boards/
│   │   │   │   └── [boardId]/
│   │   │   │       └── page.tsx          # Interactive Kanban Board Canvas Page
│   │   │   └── layout.tsx                # Protected App Shell (Sidebar, TopNav, AuthGuard)
│   │   │
│   │   ├── invites/
│   │   │   └── accept/
│   │   │       └── page.tsx              # Public Invite Accept Token Handler
│   │   │
│   │   ├── globals.css                   # Global CSS & Tailwind Directives
│   │   ├── layout.tsx                    # Root Layout with QueryClient & Auth Providers
│   │   └── page.tsx                      # Landing Page / Smart Redirect to Dashboard
│   │
│   ├── components/                       # UI Component Library
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx
│   │   │   └── SignupForm.tsx
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx               # Left Navigation Drawer & Org Switcher
│   │   │   ├── TopNav.tsx                # Profile Menu, Search Bar & Theme Switch
│   │   │   └── AuthGuard.tsx             # Session verification wrapper
│   │   ├── organizations/
│   │   │   ├── OrgCard.tsx               # Org Summary Tile
│   │   │   ├── CreateOrgModal.tsx        # New Org Dialog
│   │   │   ├── MemberTable.tsx           # Member List with Role Dropdown
│   │   │   └── InviteMemberModal.tsx     # Email Invite Generator
│   │   ├── boards/
│   │   │   ├── BoardHeader.tsx           # Board Title, Background Selector, Delete Action
│   │   │   ├── KanbanCanvas.tsx          # Drag-and-Drop DragDropContext Container
│   │   │   ├── KanbanColumn.tsx          # Section Container (Droppable Column)
│   │   │   ├── KanbanCard.tsx            # Issue Card (Draggable Item)
│   │   │   ├── QuickAddIssue.tsx         # Inline Issue creation input
│   │   │   └── IssueDetailModal.tsx      # Comprehensive Issue Drawer/Modal
│   │   └── ui/                           # Base Reusable Atomic UI Elements
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       ├── Modal.tsx
│   │       ├── Avatar.tsx
│   │       ├── Badge.tsx
│   │       └── Spinner.tsx
│   │
│   ├── hooks/                            # Custom React & React Query Hooks
│   │   ├── useAuth.ts                    # Authentication & Profile State
│   │   ├── useOrganizations.ts           # Org CRUD Mutations & Queries
│   │   ├── useBoards.ts                  # Board CRUD Queries
│   │   ├── useSections.ts                # Section Drag/Order Mutations
│   │   ├── useIssues.ts                  # Issue Drag/Order & Optimistic UI Mutations
│   │   └── useComments.ts                # Real-time Comment Thread Hooks
│   │
│   ├── lib/                              # Utility Functions & Configuration
│   │   ├── api-client.ts                 # Fetch/Axios wrapper with Bearer token interceptor
│   │   ├── constants.ts                  # API Endpoints & Config constants
│   │   └── utils.ts                      # Date formatting, order calculation helpers
│   │
│   ├── providers/                        # Global Provider Wrapper Components
│   │   ├── AuthProvider.tsx              # React Auth Context
│   │   └── QueryProvider.tsx             # TanStack Query Client Provider
│   │
│   └── types/                            # TypeScript Domain Models & Interfaces
│       ├── api.ts                        # Standardized API Request/Response Interfaces
│       ├── auth.ts                       # User & Auth Types
│       ├── org.ts                        # Organization & Member Types
│       └── board.ts                      # Board, Section, Issue, Comment Types
│
├── middleware.ts                         # Next.js Server-side Edge Auth Middleware
├── package.json
└── tsconfig.json
```

---

## 🏷️ 3. TypeScript Domain Models & Types Specification

Define these exact interfaces in `src/types/`:

```ts
// ==========================================
// 1. API Wrap Specs (matching Backend)
// ==========================================
export interface ApiResponse<T> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: "BAD_REQUEST" | "UNAUTHORIZED" | "FORBIDDEN" | "NOT_FOUND" | "INTERNAL_SERVER_ERROR";
    message: string;
    details?: Record<string, string[]>;
  };
}

// ==========================================
// 2. User & Auth Models
// ==========================================
export interface User {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt?: string;
}

export interface AuthSession {
  user: User;
  token: string;
}

// ==========================================
// 3. Organization & Member Models
// ==========================================
export type Role = "OWNER" | "ADMIN" | "MEMBER";

export interface OrganizationMember {
  id: string;
  userId: string;
  organizationId: string;
  role: Role;
  createdAt: string;
  user: User;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  avatarUrl: string | null;
  createdAt: string;
  members?: OrganizationMember[];
  userRole?: Role;
}

export interface OrganizationInvite {
  id: string;
  email: string;
  organizationId: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  token: string;
  expiresAt: string;
  createdAt: string;
}

// ==========================================
// 4. Board, Section, Issue & Comment Models
// ==========================================
export interface Comment {
  id: string;
  content: string;
  issueId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  user: User;
}

export interface IssueAssignee {
  id: string;
  issueId: string;
  userId: string;
  user: User;
}

export interface Issue {
  id: string;
  title: string;
  description: string | null;
  order: number;
  dueDate: string | null;
  sectionId: string;
  createdAt: string;
  updatedAt: string;
  assignees: IssueAssignee[];
  comments?: Comment[];
  _count?: {
    comments: number;
  };
}

export interface Section {
  id: string;
  title: string;
  order: number;
  boardId: string;
  createdAt: string;
  updatedAt: string;
  issues: Issue[];
}

export interface Board {
  id: string;
  title: string;
  backgroundColor: string;
  isClosed: boolean;
  organizationId: string;
  creatorId: string;
  createdAt: string;
  updatedAt: string;
  organization?: {
    id: string;
    name: string;
    slug: string;
  };
  creator?: User;
  sections?: Section[];
}
```

---

## ⚡ 4. API Client & Authorization Strategy

### HTTP Request Interceptor Pattern (`lib/api-client.ts`)
- Automatically reads JWT from Cookie / `localStorage`.
- Injects HTTP Header: `Authorization: Bearer <TOKEN>`.
- Globally catches `401 UNAUTHORIZED` errors and redirects to `/login`.

```text
[Client Component Action] 
       │
       ▼
[React Query Hook / Mutation] 
       │
       ▼
[apiClient Interceptor] ──(Inject Bearer Token)──► [Express API: http://localhost:5500/api/v1]
       │                                                                  │
       ◄─────────────────(Return JSON / Catch 401)────────────────────────┘
```

---

## 🗺️ 5. Complete Endpoint Integration Reference Map

This reference links every single Backend Endpoint directly to its Next.js Component & Mutation Handler.

| API Category | Method | Backend Path | Next.js Trigger Component | Hook / Service Call |
| :--- | :--- | :--- | :--- | :--- |
| **Auth** | `POST` | `/auth/signup` | `SignupForm.tsx` | `useAuth().signup(data)` |
| **Auth** | `POST` | `/auth/signin` | `LoginForm.tsx` | `useAuth().signin(data)` |
| **Auth** | `GET` | `/auth/me` | `AuthGuard.tsx` / `AuthProvider.tsx` | `useQuery(['me'], getMe)` |
| **Orgs** | `POST` | `/organizations` | `CreateOrgModal.tsx` | `useMutation(createOrg)` |
| **Orgs** | `GET` | `/organizations` | `Sidebar.tsx` / `OrgDirectory.tsx` | `useQuery(['organizations'], getOrgs)` |
| **Orgs** | `GET` | `/organizations/:orgId` | `app/(dashboard)/organizations/[orgId]` | `useQuery(['org', orgId], getOrgById)` |
| **Orgs** | `DELETE` | `/organizations/:orgId` | `OrgSettingsTab.tsx` | `useMutation(deleteOrg)` |
| **Invites** | `POST` | `/organizations/:orgId/invites` | `InviteMemberModal.tsx` | `useMutation(createInvite)` |
| **Invites** | `POST` | `/organizations/invites/accept` | `app/invites/accept/page.tsx` | `useMutation(acceptInvite)` |
| **Members** | `DELETE` | `/organizations/:orgId/members/:userId` | `MemberTable.tsx` | `useMutation(removeMember)` |
| **Boards** | `POST` | `/boards` | `CreateBoardModal.tsx` | `useMutation(createBoard)` |
| **Boards** | `GET` | `/boards` | `BoardGrid.tsx` | `useQuery(['boards', orgId], getBoards)` |
| **Boards** | `GET` | `/boards/:boardId` | `app/(dashboard)/boards/[boardId]` | `useQuery(['board', boardId], getBoardById)` |
| **Boards** | `PATCH` | `/boards/:boardId` | `BoardHeader.tsx` | `useMutation(updateBoard)` |
| **Boards** | `DELETE` | `/boards/:boardId` | `BoardHeader.tsx` | `useMutation(deleteBoard)` |
| **Sections** | `POST` | `/boards/:boardId/sections` | `AddColumnButton.tsx` | `useMutation(createSection)` |
| **Sections** | `GET` | `/boards/:boardId/sections` | `KanbanCanvas.tsx` | Included inside Board Tree Query |
| **Sections** | `PATCH` | `/sections/:sectionId` | `KanbanColumnHeader.tsx` | `useMutation(updateSection)` |
| **Sections** | `DELETE` | `/sections/:sectionId` | `KanbanColumnHeader.tsx` | `useMutation(deleteSection)` |
| **Issues** | `POST` | `/sections/:sectionId/issues` | `QuickAddIssue.tsx` | `useMutation(createIssue)` |
| **Issues** | `GET` | `/sections/:sectionId/issues` | `KanbanColumn.tsx` | Included in Section / Board Tree Query |
| **Issues** | `GET` | `/issues/:issueId` | `IssueDetailModal.tsx` | `useQuery(['issue', issueId], getIssueById)` |
| **Issues** | `PATCH` | `/issues/:issueId` | `KanbanCard.tsx` (Drag) / Modal | `useMutation(updateIssue)` (Optimistic) |
| **Issues** | `DELETE` | `/issues/:issueId` | `IssueDetailModal.tsx` | `useMutation(deleteIssue)` |
| **Assignees**| `POST` | `/issues/:issueId/assignees` | `AssigneeSelector.tsx` | `useMutation(addAssignee)` |
| **Assignees**| `DELETE` | `/issues/:issueId/assignees/:userId` | `AssigneeSelector.tsx` | `useMutation(removeAssignee)` |
| **Comments** | `POST` | `/issues/:issueId/comments` | `CommentInput.tsx` | `useMutation(createComment)` |
| **Comments** | `GET` | `/issues/:issueId/comments` | `CommentFeed.tsx` | Included inside Issue Detail Query |
| **Comments** | `PATCH` | `/comments/:commentId` | `CommentItem.tsx` | `useMutation(updateComment)` |
| **Comments** | `DELETE` | `/comments/:commentId` | `CommentItem.tsx` | `useMutation(deleteComment)` |

---

## 🎨 6. Interactive Kanban Drag-and-Drop & Fractional Order Algorithm

### Position Calculation Formula
When dragging cards or columns, calculate the new fractional `order` floating-point value:

1. **Moved to top of column**:
   `newOrder = firstCard.order / 2.0`
2. **Moved to bottom of column**:
   `newOrder = lastCard.order + 65536.0`
3. **Dropped between two cards (`cardA` and `cardB`)**:
   `newOrder = (cardA.order + cardB.order) / 2.0`

### Optimistic UI Cache Mutation Workflow

```text
[User Drags Card to New Column]
               │
               ▼
[1. Cancel outgoing React Query refetches for 'board']
               │
               ▼
[2. Snapshot previous cache state for rollback]
               │
               ▼
[3. Mutate local React Query cache state instantly (Card moves on screen immediately)]
               │
               ▼
[4. Dispatch background PATCH /issues/:issueId { sectionId, order }]
               ├───► (Success) ──► Confirm & Invalidate ['board', boardId]
               └───► (Error)   ──► Rollback cache to Snapshot & Toast Error
```

---

## 🔐 7. Edge Authentication Middleware (`middleware.ts`)

Configure Next.js Edge Middleware to intercept requests before rendering:

- **Public Routes**: `/login`, `/signup`, `/invites/accept`.
- **Protected Routes**: `/organizations`, `/boards`.
- **Behavior**:
  - If user visits `/boards/123` without a valid JWT cookie $\rightarrow$ Redirect to `/login?redirect=/boards/123`.
  - If user visits `/login` with an active valid JWT cookie $\rightarrow$ Redirect to `/organizations`.

---

## 🎨 8. UI/UX Design System Specifications

1. **Color Palette Tokens**:
   - Primary Accent: Indigo / Electric Blue (`#4F46E5`)
   - Board Background Options: Blue (`#0079BF`), Emerald (`#51E898`), Purple (`#89609E`), Dark Slate (`#172B4D`).
   - Dark Mode Neutral: Slate-900 (`#0F172A`), Slate-800 (`#1E293B`).
2. **Typography**: Google Font `Inter` or `Outfit` with crisp hierarchy (`text-sm` for cards, `text-base` for column headers, `text-xl` for board title).
3. **Empty States & Skeletons**:
   - Column Skeleton Pulse loaders while initial board details load.
   - Friendly Empty States for boards without sections or sections without cards.
