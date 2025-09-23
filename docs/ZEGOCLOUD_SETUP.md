# ZegoCloud Integration Setup Guide

## Bước 1: Setup ZegoCloud Account

1. Đăng ký tài khoản tại [ZegoCloud Console](https://console.zegocloud.com/)
2. Tạo project mới và lấy `App ID` và `Server Secret`
3. Copy file `.env.local.example` thành `.env.local` và điền thông tin:

```env
ZEGO_APP_ID=your-app-id
ZEGO_SERVER_SECRET=your-server-secret
```

## Bước 2: Install ZegoCloud SDK

```bash
npm install zego-express-engine-webrtc
```

## Bước 3: Backend API Endpoints

### 1. Create Session API

**Endpoint:** `POST /api/mentor/create-session`

**Request Body:**

```json
{
  "mentorId": "mentor_001",
  "studentId": "L001",
  "slotId": "mon-09-10",
  "sessionType": "Speaking Practice"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "sessionId": "session_xxx",
    "roomId": "room_xxx",
    "token": "zego_token_xxx",
    "appId": 123456789,
    "expiresAt": "2025-09-23T15:00:00Z"
  }
}
```

### 2. Notify Student API

**Endpoint:** `POST /api/mentor/notify-session-start`

**Request Body:**

```json
{
  "studentId": "L001",
  "roomId": "room_xxx",
  "token": "student_token",
  "mentorName": "Nguyễn Văn Minh",
  "sessionType": "Speaking Practice",
  "startTime": "09:00",
  "endTime": "10:00"
}
```

## Bước 4: Socket.IO Integration

### Server Side (Socket Events)

```javascript
// Emit to specific student
io.to(`student_L001`).emit("session_notification", {
  roomId: "room_xxx",
  token: "student_token_xxx",
  mentorName: "Nguyễn Văn Minh",
  message: "Your mentor has started the session!",
});
```

### Client Side (Student App)

```javascript
// Listen for session notifications
socket.on("session_notification", (data) => {
  // Show notification to student
  showNotification({
    title: "Session Started!",
    message: data.message,
    action: () => joinMeeting(data.roomId, data.token),
  });
});
```

## Bước 5: ZegoCloud Integration Flow

### Mentor Flow:

1. Click "Start Session" → Call `createZegoSession()` API
2. API generates `roomId` + `token` for mentor
3. API calls `notifyStudentSessionStart()` to send socket notification to student
4. Mentor redirects to `/meeting?roomId=xxx&token=xxx&role=mentor`

### Student Flow:

1. Receive socket notification with `roomId` + student `token`
2. Student clicks join → redirect to `/meeting?roomId=xxx&token=xxx&role=student`
3. Both join same ZegoCloud room with their respective tokens

## Bước 6: Database Schema (Recommended)

### Sessions Table

```sql
CREATE TABLE sessions (
  id VARCHAR PRIMARY KEY,
  room_id VARCHAR UNIQUE,
  mentor_id VARCHAR,
  student_id VARCHAR,
  slot_id VARCHAR,
  session_type VARCHAR,
  status ENUM('created', 'active', 'ended'),
  created_at TIMESTAMP,
  started_at TIMESTAMP,
  ended_at TIMESTAMP,
  expires_at TIMESTAMP
);
```

### Session Tokens Table

```sql
CREATE TABLE session_tokens (
  id VARCHAR PRIMARY KEY,
  session_id VARCHAR,
  user_id VARCHAR,
  user_role ENUM('mentor', 'student'),
  token VARCHAR,
  expires_at TIMESTAMP
);
```

## Bước 7: Production Considerations

1. **Security**: Validate tokens server-side before allowing room access
2. **Scalability**: Use Redis for session storage in production
3. **Monitoring**: Log all session events for debugging
4. **Error Handling**: Implement retry mechanisms for network failures
5. **Cleanup**: Automatically cleanup expired sessions/tokens

## Testing

1. Start development server: `npm run dev`
2. Navigate to mentor schedule page
3. Click "Start Session" on any booked slot
4. Check browser console for API calls and socket events
5. Verify meeting page opens with correct parameters

## Troubleshooting

- **Token Invalid**: Check ZegoCloud App ID and Server Secret
- **Socket Not Connected**: Verify Socket.IO server is running
- **Room Join Failed**: Check network connectivity and token expiration
