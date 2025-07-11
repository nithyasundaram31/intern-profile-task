**Profile Task**

This is the fullStack web application  build using MERN stack(Node.js express.js, mongoDb , react)
it allows user register,login view and update their profile 

**Authentication Flow**

1) On login/register, the backend returns a JWT token

2) Token is stored in localStorage

3) All protected routes (like /profile) require token to access

4) Token is sent in request headers:
 Authorization: Bearer <token>

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

