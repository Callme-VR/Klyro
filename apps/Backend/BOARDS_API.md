# Board API Specifications & Reference

Comprehensive documentation for all Board REST endpoints implemented in `apps/Backend`.

---

## 🔒 Authorization & Security

- **Authentication Header**: `Authorization: Bearer <JWT_TOKEN>`
- **Organization Membership Rule**: A user **must be an active member** of the organization associated with a board to create, read, update, or delete that board.
- **Middleware**: Handled automatically by `authenticateToken` in [auth.middleware.ts](file:///d:/Complex_backend/trello/apps/Backend/src/middlewares/auth.middleware.ts).

---

## 📝 Input Validation Schemas (Zod)

Defined in [board.Schemas.ts](file:///d:/Complex_backend/trello/apps/Backend/src/models/board.Schemas.ts):

### `CreateBoardSchema`
- `title`: Required non-empty string, max 100 characters. Trimmed automatically.
- `organizationId`: Required valid UUID string.
- `backgroundColor`: Optional hex color string matching `/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/`. Defaults to `"#0079BF"`.

### `UpdateBoardSchema`
- `title`: Optional non-empty string, max 100 characters. Trimmed automatically.
- `backgroundColor`: Optional hex color string matching `/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/`.
- `isClosed`: Optional boolean.

---

## 🚀 Endpoints Reference

### 1. Create Board
- **Method**: `POST`
- **Path**: `/api/v1/boards`
- **Controller**: `CreateBoard` in [board.controller.ts](file:///d:/Complex_backend/trello/apps/Backend/src/controllers/board.controller.ts)
- **Service**: `createBoardService` in [board.service.ts](file:///d:/Complex_backend/trello/apps/Backend/src/services/board.service.ts)

#### Request Body
```json
{
  "title": "Backend Engineering Board",
  "organizationId": "c022830f-b12a-4a57-b0cb-46540c7d6c55",
  "backgroundColor": "#0079BF"
}
```

#### Response (201 Created)
```json
{
  "success": true,
  "data": {
    "id": "df9d953b-745e-482b-b7f8-497a3addf5db",
    "title": "Backend Engineering Board",
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

### 2. List Boards
- **Method**: `GET`
- **Path**: `/api/v1/boards` (or `/api/v1/boards?orgId=<ORG_UUID>`)
- **Controller**: `GetBoards`
- **Service**: `getBoardService`

#### Response (200 OK)
```json
{
  "success": true,
  "data": [
    {
      "id": "df9d953b-745e-482b-b7f8-497a3addf5db",
      "title": "Backend Engineering Board",
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

### 3. Get Single Board
- **Method**: `GET`
- **Path**: `/api/v1/boards/:boardId`
- **Controller**: `GetBoardById`
- **Service**: `getBoardByIdService`

#### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "id": "df9d953b-745e-482b-b7f8-497a3addf5db",
    "title": "Backend Engineering Board",
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

### 4. Update Board
- **Method**: `PATCH`
- **Path**: `/api/v1/boards/:boardId`
- **Controller**: `UpdateBoard`
- **Service**: `updateBoardService`

#### Request Body
```json
{
  "title": "Updated Sprint Board Title",
  "backgroundColor": "#51E898",
  "isClosed": false
}
```

#### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "id": "df9d953b-745e-482b-b7f8-497a3addf5db",
    "title": "Updated Sprint Board Title",
    "backgroundColor": "#51E898",
    "isClosed": false,
    "updatedAt": "2026-08-15T09:10:00.000Z"
  }
}
```

---

### 5. Delete Board
- **Method**: `DELETE`
- **Path**: `/api/v1/boards/:boardId`
- **Controller**: `DeleteBoard`
- **Service**: `deleteBoardService`

#### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "message": "Board deleted successfully"
  }
}
```
