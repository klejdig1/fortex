# Deploying Fortex (Netlify + API)

## Why you see `ERR_CONNECTION_REFUSED` on Netlify

The app is built to call the API at `http://localhost:4000`. On Netlify, the browser runs on the user’s device and tries to open that URL, but nothing is listening there, so you get **connection refused**.

You need to:

1. **Deploy the API** somewhere public (not Netlify – Netlify is for the frontend).
2. **Tell the frontend** that API URL using an env var on Netlify.

---

## 1. Deploy the backend (API)

Deploy the **server** (Express + Prisma) to a host that runs Node, for example:

- **Render** (https://render.com) – free tier, good for Node + Postgres  
- **Railway** (https://railway.app)  
- **Fly.io** (https://fly.io)

Steps in short:

- Connect the repo and set the **root** or **start command** to run the server (e.g. `node server/src/index.js` or whatever your `package.json` `start` script does).
- Add a **Postgres** database and set `DATABASE_URL` in the service’s environment.
- Run migrations (e.g. `npx prisma migrate deploy`) in the build or release step.
- Note the **public URL** of the API (e.g. `https://fortex-api.onrender.com`).

On the backend service, set:

- `FRONTEND_ORIGIN` = your Netlify URL (e.g. `https://fortex01.netlify.app`)  
  so CORS allows the Netlify site to call the API.  
  You can allow multiple origins separated by commas:  
  `https://fortex01.netlify.app,http://localhost:5173`

---

## 2. Configure the frontend on Netlify

1. In Netlify: **Site configuration** → **Environment variables**.
2. Add a variable:
   - **Key:** `VITE_API_BASE`
   - **Value:** your backend URL (e.g. `https://fortex-api.onrender.com`)  
     No trailing slash.
3. **Save** and then **Trigger deploy** → **Deploy site** (or push a new commit).

Vite bakes `VITE_API_BASE` into the build, so a new deploy is required after changing it.

---

## 3. Summary

| Where        | What to set                | Example                          |
|-------------|----------------------------|----------------------------------|
| Netlify     | `VITE_API_BASE`           | `https://fortex-api.onrender.com` |
| Backend host| `FRONTEND_ORIGIN`         | `https://fortex01.netlify.app`   |

After that, the site on Netlify will call your deployed API instead of `localhost:4000`, and the connection refused error should go away.
