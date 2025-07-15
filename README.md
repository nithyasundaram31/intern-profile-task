**Profile Task**

This is a FullStack Web Application built using the MERN Stack (MongoDB, Express.js, React.js, Node.js) along with Redis (Upstash) for secure session/token management.
It allows users to register, login, view, and update their profile securely.

**Authentication Flow**

1) On login/register, the backend returns a JWT token

2) This token is stored in localStorage on the frontend.

3) All protected routes (like /profile) require the token to be sent in request headers:

Authorization: Bearer <token>

4) The token is verified on the backend and  checked in Redis.

5) MongoDB is used for permanent user data storage.

 **Redis Integration**

 - This project uses Redis (via Upstash) as a temporary in-memory cache for improved performance and session management.

 - MongoDB is used for permanent data storage (user info).

Redis is used as a temporary store (cache) :

- Store user sessions (JWT tokens)

- Store user profile data

- Speed up repeated requests without hitting the database every time


**Technologies Used**

**Frontend**

- React.js 

- React-router-Dom

- Tailwind CSS

- Axios

**Backend**

- Node.js

- Express.js

- Mongoose

- bcryptjs

- dotenv

- JSONWebTokens (JWT)

- Redis via upstash(https://upstash.com/)

 **Backend Environtment Variable setup**
```env
MONGODB_URI=<your cluster url..>
JWT_SECRET=yourSecretKey
UPSTASH_REDIS_URL=your-upstash-url
UPSTASH_REDIS_TOKEN=your-upstash-token