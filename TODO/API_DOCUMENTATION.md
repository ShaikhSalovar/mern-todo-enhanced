# API Documentation

## Base URL

- **Development**: `http://localhost:5000`
- **Production**: `https://your-backend.onrender.com`

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

---

## Authentication Endpoints

### Register User

Create a new user account.

- **URL**: `/api/auth/register`
- **Method**: `POST`
- **Auth Required**: No

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Validation Rules:**
- `name`: Required, minimum 3 characters
- `email`: Required, valid email format, unique
- `password`: Required, minimum 8 characters

**Success Response (201):**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "64a1b2c3d4e5f6789012345",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "",
    "location": "",
    "bio": "",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Responses:**

| Status | Message |
|--------|---------|
| 400 | Please provide all required fields |
| 400 | Name must be at least 3 characters |
| 400 | Password must be at least 8 characters |
| 400 | User with this email already exists |
| 500 | Server error during registration |

---

### Login User

Authenticate user and receive JWT token.

- **URL**: `/api/auth/login`
- **Method**: `POST`
- **Auth Required**: No

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Success Response (200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "64a1b2c3d4e5f6789012345",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "",
    "location": "",
    "bio": "",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Responses:**

| Status | Message |
|--------|---------|
| 400 | Please provide email and password |
| 401 | Invalid email or password |
| 500 | Server error during login |

---

### Get User Profile

Get current authenticated user's profile with statistics.

- **URL**: `/api/auth/profile`
- **Method**: `GET`
- **Auth Required**: Yes

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "user": {
    "_id": "64a1b2c3d4e5f6789012345",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "location": "New York, USA",
    "bio": "Software Developer",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T12:00:00.000Z"
  },
  "stats": {
    "totalTasks": 25,
    "completedTasks": 18,
    "successRate": 72
  }
}
```

**Error Responses:**

| Status | Message |
|--------|---------|
| 401 | No token, authorization denied |
| 401 | Invalid token |
| 404 | User not found |
| 500 | Server error |

---

### Update User Profile

Update authenticated user's profile information.

- **URL**: `/api/auth/profile`
- **Method**: `PUT`
- **Auth Required**: Yes

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "John Smith",
  "email": "johnsmith@example.com",
  "phone": "+1234567890",
  "location": "New York, USA",
  "bio": "Full Stack Developer"
}
```

*All fields are optional*

**Success Response (200):**
```json
{
  "message": "Profile updated successfully",
  "user": {
    "_id": "64a1b2c3d4e5f6789012345",
    "name": "John Smith",
    "email": "johnsmith@example.com",
    "phone": "+1234567890",
    "location": "New York, USA",
    "bio": "Full Stack Developer",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T14:00:00.000Z"
  }
}
```

**Error Responses:**

| Status | Message |
|--------|---------|
| 400 | Name must be at least 3 characters |
| 400 | Email already in use |
| 401 | No token, authorization denied |
| 500 | Server error |

---

### Change Password

Change authenticated user's password.

- **URL**: `/api/auth/change-password`
- **Method**: `PUT`
- **Auth Required**: Yes

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "currentPassword": "OldPassword123",
  "newPassword": "NewSecurePass456"
}
```

**Success Response (200):**
```json
{
  "message": "Password changed successfully"
}
```

**Error Responses:**

| Status | Message |
|--------|---------|
| 400 | Please provide current and new password |
| 400 | New password must be at least 8 characters |
| 401 | Current password is incorrect |
| 401 | No token, authorization denied |
| 404 | User not found |
| 500 | Server error |

---

## Todo Endpoints

### Create Todo

Create a new todo item.

- **URL**: `/add`
- **Method**: `POST`
- **Auth Required**: Yes

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "task": "Complete project documentation",
  "priority": "high",
  "status": "pending"
}
```

**Field Options:**
- `priority`: `"low"`, `"medium"`, `"high"` (default: `"medium"`)
- `status`: `"pending"`, `"in-progress"`, `"completed"` (default: `"pending"`)

**Success Response (200):**
```json
{
  "_id": "64b2c3d4e5f67890123456",
  "userId": "64a1b2c3d4e5f6789012345",
  "task": "Complete project documentation",
  "status": "pending",
  "priority": "high",
  "completedAt": null,
  "createdAt": "2024-01-15T15:00:00.000Z",
  "updatedAt": "2024-01-15T15:00:00.000Z"
}
```

---

### Get Todos

Get all todos for authenticated user with pagination and filtering.

- **URL**: `/get`
- **Method**: `GET`
- **Auth Required**: Yes

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | number | 1 | Page number |
| limit | number | 10 | Items per page |
| status | string | - | Filter by status |
| search | string | - | Search in task text |

**Example Request:**
```
GET /get?page=1&limit=5&status=pending&search=project
```

**Success Response (200):**
```json
{
  "todos": [
    {
      "_id": "64b2c3d4e5f67890123456",
      "userId": "64a1b2c3d4e5f6789012345",
      "task": "Complete project documentation",
      "status": "pending",
      "priority": "high",
      "completedAt": null,
      "createdAt": "2024-01-15T15:00:00.000Z",
      "updatedAt": "2024-01-15T15:00:00.000Z"
    }
  ],
  "totalPages": 3,
  "currentPage": 1,
  "stats": {
    "total": 25,
    "pending": 10,
    "inProgress": 5,
    "completed": 10
  }
}
```

---

### Update Todo Status

Update the status of a todo item.

- **URL**: `/status/:id`
- **Method**: `PUT`
- **Auth Required**: Yes

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `id`: Todo ID

**Request Body:**
```json
{
  "status": "completed"
}
```

**Status Flow Rules:**
- `pending` → `in-progress` ✓
- `pending` → `completed` ✗
- `in-progress` → `completed` ✓
- `in-progress` → `pending` ✗
- `completed` → any ✗

**Success Response (200):**
```json
{
  "_id": "64b2c3d4e5f67890123456",
  "userId": "64a1b2c3d4e5f6789012345",
  "task": "Complete project documentation",
  "status": "completed",
  "priority": "high",
  "completedAt": "2024-01-15T18:00:00.000Z",
  "createdAt": "2024-01-15T15:00:00.000Z",
  "updatedAt": "2024-01-15T18:00:00.000Z"
}
```

**Error Responses:**

| Status | Message |
|--------|---------|
| 401 | No token, authorization denied |
| 404 | Todo not found |
| 500 | Server error |

---

### Update Todo Task

Update the task text and/or priority of a todo item.

- **URL**: `/update/:id`
- **Method**: `PUT`
- **Auth Required**: Yes

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `id`: Todo ID

**Request Body:**
```json
{
  "task": "Updated task description",
  "priority": "medium"
}
```

*Both fields are optional*

**Success Response (200):**
```json
{
  "_id": "64b2c3d4e5f67890123456",
  "userId": "64a1b2c3d4e5f6789012345",
  "task": "Updated task description",
  "status": "pending",
  "priority": "medium",
  "completedAt": null,
  "createdAt": "2024-01-15T15:00:00.000Z",
  "updatedAt": "2024-01-15T16:30:00.000Z"
}
```

---

### Delete Todo

Delete a todo item.

- **URL**: `/delete/:id`
- **Method**: `DELETE`
- **Auth Required**: Yes

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `id`: Todo ID

**Success Response (200):**
```json
{
  "_id": "64b2c3d4e5f67890123456",
  "userId": "64a1b2c3d4e5f6789012345",
  "task": "Deleted task",
  "status": "pending",
  "priority": "medium",
  "completedAt": null,
  "createdAt": "2024-01-15T15:00:00.000Z",
  "updatedAt": "2024-01-15T15:00:00.000Z"
}
```

**Error Responses:**

| Status | Message |
|--------|---------|
| 401 | No token, authorization denied |
| 404 | Todo not found |
| 500 | Server error |

---

## Error Response Format

All error responses follow this format:

```json
{
  "message": "Error description here"
}
```

## Rate Limiting

Currently, there is no rate limiting implemented. Consider adding rate limiting for production use.

## CORS

The API allows requests from all origins in development. For production, configure CORS to allow only your frontend domain.
