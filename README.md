# FileDock

Next.js file manager (categories > folders > files). Data is stored in MongoDB Atlas, uploaded files in Cloudinary.

## Setup

1. `npm install`
2. Fill in `.env.local` (MongoDB URI + Cloudinary keys)
3. In MongoDB Atlas > Network Access, allow your IP (or `0.0.0.0/0` for testing)
4. `npm run dev` then open http://localhost:3000

No login: the app opens straight to the dashboard.
