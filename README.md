**Profile Task**

This is a FullStack Web Application built using the MERN Stack (MongoDB, Express.js, React.js, Node.js) along with Redis (Upstash) for secure session/token management.
It allows users to register, login, view, and update their profile securely.

**Authentication Flow**

1) On login/register, the backend returns a JWT token


2) I implemented JWT-based authentication and stored tokens in Redis via Upstash using key-value pairs with 24-hour expiry.

3) Token is stored in localStorage

4) All protected routes (like /profile) require token to access

5) Token is sent in request headers:
 Authorization: Bearer <token>

6) MongoDB for storing user data

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