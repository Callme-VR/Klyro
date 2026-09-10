# Trello Backend API Endpoint Specifications

This document defines the RESTful API endpoint specifications for the Trello Backend service (`apps/Backend`). All endpoints correspond strictly to the Prisma database schema defined in `packages/db/prisma/schema.prisma` and the controller/route logic in `apps/Backend/src`.

---

## 🌐 Global Specifications & Conventions

- **Base URL**: `http://localhost:5500/api/v1`
- **Data Format**: `application/json`
- **Authentication**: Bearer Token (JWT) sent via HTTP Header: `Authorization: Bearer <JWT_TOKEN>`
- **Error Response Structure**:
```json
{
  "success": false,
  "error": {
    "code": "BAD_REQUEST",
    "message": "Detailed error explanation",
    "details": {}
  }
}
```

---

## 📊 Summary of Active Endpoints

| Category | Method | Endpoint Path | Description | Controller Function | Auth Required |
| :--- | :--- | :--- | :--- | :--- | :---: |
| **Auth** | `POST` | `/api/v1/auth/signup` | Register new user account & get JWT token | `Signup` | ❌ No |
| **Auth** | `POST` | `/api/v1/auth/signin` | Authenticate credentials & get JWT token | `Signin` | ❌ No |
| **Auth** | `GET` | `/api/v1/auth/me` | Get profile of authenticated user | `GetMe` | ✅ Yes |
| **Organizations** | `POST` | `/api/v1/organizations` | Create new organization (Assigns creator as `OWNER`) | `CreateOrg` | ✅ Yes |
| **Organizations** | `GET` | `/api/v1/organizations` | List all organizations for authenticated user | `GetUserOrgs` | ✅ Yes |
| **Organizations** | `GET` | `/api/v1/organizations/:orgId` | Get detailed organization info & member list | `GetOrgById` | ✅ Yes |
| **Organizations** | `DELETE` | `/api/v1/organizations/:orgId` | Delete organization (Owner only) | `DeleteOrg` | ✅ Yes |
| **Invites** | `POST` | `/api/v1/organizations/:orgId/invites` | Create email invitation token (Owner/Admin only) | `CreateOrgInvite` | ✅ Yes |
| **Invites** | `POST` | `/api/v1/organizations/invites/accept` | Accept invitation token to join organization | `AcceptOrgInvite` | ✅ Yes |
| **Members** | `DELETE` | `/api/v1/organizations/:orgId/members/:userId` | Remove member from organization | `RemoveOrgMember` | ✅ Yes |
| **Boards** | `POST` | `/api/v1/boards` | Create a new board inside an organization | `CreateBoard` | ✅ Yes |
| **Boards** | `GET` | `/api/v1/boards` | List all boards (Optional `?orgId=...` filter) | `GetBoards` | ✅ Yes |
| **Boards** | `GET` | `/api/v1/boards/:boardId` | Get single board with sections & nested issues | `GetBoardById` | ✅ Yes |
| **Boards** | `PATCH` | `/api/v1/boards/:boardId` | Update board title, background color, or closed state | `UpdateBoard` | ✅ Yes |
| **Boards** | `DELETE` | `/api/v1/boards/:boardId` | Delete board (Cascades to sections & issues) | `DeleteBoard` | ✅ Yes |
| **Sections** | `POST` | `/api/v1/boards/:boardId/sections` | Create a new section inside a board | `CreateSection` | ✅ Yes |
| **Sections** | `GET` | `/api/v1/boards/:boardId/sections` | List all sections for a board | `GetSections` | ✅ Yes |
| **Sections** | `PATCH` | `/api/v1/sections/:sectionId` | Update section title or order | `UpdateSection` | ✅ Yes |
| **Sections** | `DELETE` | `/api/v1/sections/:sectionId` | Delete a section | `DeleteSection` | ✅ Yes |

---

## 1. Authentication Endpoints

### 1.1 `POST /api/v1/auth/signup`
Registers a new user account and hashes the password with Argon2id.

- **Auth Required**: No
- **Request Body**:
```json
{
  "email": "alex@example.com",
  "password": "SecurePassword123!",
  "name": "Alex Mercer",
  "avatarUrl": "https://example.com/avatar.jpg"
}
```
- **Success Response (201 Created)**:
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "user": {
      "id": "b18b4e78-89ab-4c4f-9ef4-123456789abc",
      "email": "alex@example.com",
      "name": "Alex Mercer",
      "avatarUrl": "https://example.com/avatar.jpg",
      "createdAt": "2026-08-15T08:20:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 1.2 `POST /api/v1/auth/signin`
Authenticates existing credentials and returns a JWT Bearer Token.

- **Auth Required**: No
- **Request Body**:
```json
{
  "email": "alex@example.com",
  "password": "SecurePassword123!"
}
```
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "b18b4e78-89ab-4c4f-9ef4-123456789abc",
      "email": "alex@example.com",
      "name": "Alex Mercer",
      "avatarUrl": "https://example.com/avatar.jpg"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 1.3 `GET /api/v1/auth/me`
Fetches current authenticated user profile.

- **Auth Required**: Yes (`Bearer <token>`)
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "id": "b18b4e78-89ab-4c4f-9ef4-123456789abc",
    "email": "alex@example.com",
    "name": "Alex Mercer",
    "avatarUrl": "https://example.com/avatar.jpg",
    "createdAt": "2026-08-15T08:20:00.000Z",
    "updatedAt": "2026-08-15T08:20:00.000Z"
  }
}
```

---

## 2. Organization & Member Endpoints

### 2.1 `POST /api/v1/organizations`
Creates a new organization. The creator is assigned `role: "OWNER"`.

- **Auth Required**: Yes
- **Request Body**:
```json
{
  "name": "Acme Engineering",
  "slug": "acme-engineering",
  "description": "Product & Engineering Teams",
  "avatarUrl": "https://example.com/org-logo.png"
}
```
- **Success Response (201 Created)**:
```json
{
  "success": true,
  "data": {
    "id": "c022830f-b12a-4a57-b0cb-46540c7d6c55",
    "name": "Acme Engineering",
    "slug": "acme-engineering",
    "description": "Product & Engineering Teams",
    "avatarUrl": "https://example.com/org-logo.png",
    "createdAt": "2026-08-15T08:25:00.000Z",
    "userRole": "OWNER"
  }
}
```

---

### 2.2 `GET /api/v1/organizations`
Lists all organizations where the authenticated user is a member.

- **Auth Required**: Yes
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "data": [
    {
      "id": "c022830f-b12a-4a57-b0cb-46540c7d6c55",
      "name": "Acme Engineering",
      "slug": "acme-engineering",
      "role": "OWNER",
      "createdAt": "2026-08-15T08:25:00.000Z"
    }
  ]
}
```

---

### 2.3 `GET /api/v1/organizations/:orgId`
Retrieves detailed organization data including member list and board metadata.

- **Auth Required**: Yes (Must be member of org)
- **Path Params**: `orgId` (UUID)
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "id": "c022830f-b12a-4a57-b0cb-46540c7d6c55",
    "name": "Acme Engineering",
    "slug": "acme-engineering",
    "members": [
      {
        "id": "mem-1111",
        "role": "OWNER",
        "user": {
          "id": "b18b4e78-89ab-4c4f-9ef4-123456789abc",
          "email": "alex@example.com",
          "name": "Alex Mercer"
        }
      }
    ],
    "currentUserRole": "OWNER"
  }
}
```

---

### 2.4 `POST /api/v1/organizations/:orgId/invites`
Generates a unique invitation token for an email address.

- **Auth Required**: Yes (Must have `OWNER` or `ADMIN` role)
- **Path Params**: `orgId` (UUID)
- **Request Body**:
```json
{
  "email": "teammate@example.com"
}
```
- **Success Response (201 Created)**:
```json
{
  "success": true,
  "data": {
    "id": "inv-9999",
    "email": "teammate@example.com",
    "organizationId": "c022830f-b12a-4a57-b0cb-46540c7d6c55",
    "status": "PENDING",
    "token": "e5d79124-789a-4c91-b123-999888777666",
    "expiresAt": "2026-08-22T08:25:00.000Z"
  }
}
```

---

### 2.5 `POST /api/v1/organizations/invites/accept`
Accepts an organization invitation token and adds the authenticated user as a member (`role: MEMBER`).

- **Auth Required**: Yes
- **Request Body**:
```json
{
  "token": "e5d79124-789a-4c91-b123-999888777666"
}
```
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "organizationId": "c022830f-b12a-4a57-b0cb-46540c7d6c55",
    "role": "MEMBER"
  }
}
```

---

### 2.6 `DELETE /api/v1/organizations/:orgId/members/:userId`
Removes a member from an organization.

- **Auth Required**: Yes (Must be `OWNER`, `ADMIN`, or self-removal)
- **Path Params**: `orgId` (UUID), `userId` (UUID)
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "message": "Member removed successfully"
  }
}
```

---

### 2.7 `DELETE /api/v1/organizations/:orgId`
Deletes an organization and cascades deletion across members and invites.

- **Auth Required**: Yes (User must have `OWNER` role)
- **Path Params**: `orgId` (UUID)
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "message": "Organization Deleted Successfully"
  }
}
```

---

## 3. Board Endpoints

### 3.1 `POST /api/v1/boards`
Creates a new board within an organization. The user must be a member of the organization.

- **Auth Required**: Yes
- **Request Body**:
```json
{
  "title": "Sprint Planning Board",
  "organizationId": "c022830f-b12a-4a57-b0cb-46540c7d6c55",
  "backgroundColor": "#0079BF"
}
```
- **Success Response (201 Created)**:
```json
{
  "success": true,
  "data": {
    "id": "df9d953b-745e-482b-b7f8-497a3addf5db",
    "title": "Sprint Planning Board",
    "backgroundColor": "#0079BF",
    "isClosed": false,
    "organizationId": "c022830f-b12a-4a57-b0cb-46540c7d6c55",
    "creatorId": "b18b4e78-89ab-4c4f-9ef4-123456789abc",
    "createdAt": "2026-08-15T09:00:00.000Z",
    "updatedAt": "2026-08-15T09:00:00.000Z",
    "creator": {
      "id": "b18b4e78-89ab-4c4f-9ef4-123456789abc",
      "name": "Alex Mercer",
      "email": "alex@example.com",
      "avatarUrl": "https://example.com/avatar.jpg"
    }
  }
}
```

---

### 3.2 `GET /api/v1/boards`
Lists active boards across all organizations the user belongs to, or for a specific organization if `?orgId=...` is supplied.

- **Auth Required**: Yes
- **Query Params**: `orgId` (Optional UUID)
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "data": [
    {
      "id": "df9d953b-745e-482b-b7f8-497a3addf5db",
      "title": "Sprint Planning Board",
      "backgroundColor": "#0079BF",
      "isClosed": false,
      "organizationId": "c022830f-b12a-4a57-b0cb-46540c7d6c55",
      "creatorId": "b18b4e78-89ab-4c4f-9ef4-123456789abc",
      "createdAt": "2026-08-15T09:00:00.000Z",
      "_count": {
        "sections": 0
      }
    }
  ]
}
```

---

### 3.3 `GET /api/v1/boards/:boardId`
Fetches a single board with full nested relations (sections, ordered issues, assignees, and comment counts).

- **Auth Required**: Yes (Must be member of board's organization)
- **Path Params**: `boardId` (UUID)
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "id": "df9d953b-745e-482b-b7f8-497a3addf5db",
    "title": "Sprint Planning Board",
    "backgroundColor": "#0079BF",
    "isClosed": false,
    "organization": {
      "id": "c022830f-b12a-4a57-b0cb-46540c7d6c55",
      "name": "Acme Engineering",
      "slug": "acme-engineering"
    },
    "creator": {
      "id": "b18b4e78-89ab-4c4f-9ef4-123456789abc",
      "name": "Alex Mercer",
      "email": "alex@example.com"
    },
    "sections": []
  }
}
```

---

### 3.4 `PATCH /api/v1/boards/:boardId`
Updates board title, background color, or closed status.

- **Auth Required**: Yes (Must be member of board's organization)
- **Path Params**: `boardId` (UUID)
- **Request Body**:
```json
{
  "title": "Updated Sprint Board",
  "backgroundColor": "#51E898"
}
```
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "id": "df9d953b-745e-482b-b7f8-497a3addf5db",
    "title": "Updated Sprint Board",
    "backgroundColor": "#51E898",
    "isClosed": false,
    "updatedAt": "2026-08-15T09:10:00.000Z"
  }
}
```

---

### 3.5 `DELETE /api/v1/boards/:boardId`
Deletes a board and cascades deletion across sections, issues, assignees, and comments.

- **Auth Required**: Yes (Must be member of board's organization)
- **Path Params**: `boardId` (UUID)
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "message": "Board deleted successfully"
  }
}
```

