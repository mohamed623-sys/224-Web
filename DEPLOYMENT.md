Deployment guide

This repo contains a Vite React frontend and a small Node Express server (server/index.js) used for paymob checkout and other server-side logic.

We'll deploy the frontend to Vercel (recommended) and the server to Render (or any Node host). Below are step-by-step instructions.

1) Prepare environment variables

Frontend (Vercel):
- VITE_FIREBASE_API_KEY (only if using Firestore client in the browser)
- VITE_FIREBASE_AUTH_DOMAIN
- VITE_FIREBASE_PROJECT_ID
- VITE_FIREBASE_STORAGE_BUCKET
- VITE_FIREBASE_MESSAGING_SENDER_ID
- VITE_FIREBASE_APP_ID
- VITE_CLERK_PUBLISHABLE_KEY
- VITE_ADMIN_EMAIL (admin account email)
- VITE_BACKEND_URL (set to your deployed server URL, e.g., https://your-server.onrender.com)

Server (Render / Railway / VPS):
- (Optional) PAYMOB_API_KEY (server-side secret) — only if you want to use Paymob for Egypt payment methods
- (Optional) PAYMOB_INTEGRATION_ID
- (Optional) PAYMOB_IFRAME_ID
- (Optionally) other secrets like Firebase Admin SDK if you wish to use Admin SDK
Additional server flags:
- USE_PAYMOB (false by default). Set to `true` to enable the server Paymob flow. When enabled the server `/api/checkout` will proxy to `/api/paymob/checkout`.

Products storage:
- The server now persists products to `server/products.json`. The Admin UI uses the server REST API (`/api/products`) for CRUD operations. When deploying, ensure the server has write permissions to persist this file or replace with a proper DB.

2) Deploy server (Render example)
- Create a new Web Service on Render
- Connect your repo, set the Root to `/server`
- Set the start command to: `node index.js`
- Add environment variables listed above to the Render dashboard. Note: Paymob keys are optional and should be set only on the server when you have merchant credentials.
- To test Paymob in sandbox:
	1. Create a Paymob test merchant (Paymob dashboard) and obtain sandbox API key, integration id and iframe id.
	2. Set `PAYMOB_API_KEY`, `PAYMOB_INTEGRATION_ID`, `PAYMOB_IFRAME_ID` as server environment variables on Render.
	3. Set `USE_PAYMOB=true` on the server env so `/api/checkout` proxies to the Paymob flow.
	4. Use the deployed site to checkout and verify the Paymob sandbox iframe opens and completes (sandbox mode in Paymob).
- Deploy and copy the public URL (e.g., https://my-224-server.onrender.com)

3) Deploy frontend (Vercel example)
- Create a new Vercel project and point to the repo root
- Add the frontend environment variables (VITE_*) in the Vercel project settings
- Set `VITE_BACKEND_URL` to the server URL from step 2
- Deploy. Vercel will build the frontend and provide a domain like `https://your-project.vercel.app`

4) Test payments
- If you plan to accept Egypt-specific payment methods (Meeza, Vodafone Cash) you'll need a Paymob merchant account (or another PSP that supports those methods) and the server-side API keys/integration IDs. The server will then call Paymob and return an iframe URL to the browser.

Notes
- Keep Paymob secret keys only in server-side env variables.
- For admin security, use Clerk or Firebase custom claims and enforce server-side rules in Firestore.
- If you prefer a single deployment (frontend + server) use Render for both or deploy serverless functions on Vercel and set server envs there.

If you want, I can prepare a `vercel.json` and `render.yaml` for easier one-click deploys once you confirm the provider.
