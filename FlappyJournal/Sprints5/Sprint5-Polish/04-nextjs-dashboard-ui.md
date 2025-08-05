> Status: Complete

# 04 – Next.js Dashboard UI

**Objective:**  
Deploy a secure Next.js dashboard to visualize quantum system metrics and status in real time.

**Why it matters:**  
DevOps and SREs need a live, actionable view of system health. A rich dashboard enables rapid diagnosis and
confidence in production.

---

## Preconditions

- Next.js 14+ app present in `client/` (`npx create-next-app@latest client`)
- Prometheus `/metrics` endpoint live at e.g. `http://localhost:3000/metrics`
- Grafana dashboards published and accessible
- Keycloak/Auth0 credentials for login integration
- HTTPS certificate (for production)

---

## Procedure

### 1. Scaffold Dashboard Page

1. In `client/pages/`, create `dashboard.js` (or `.tsx`):
   ```jsx
   import dynamic from 'next/dynamic';
   export default function Dashboard() {
     return (
       <main>
         <h1>Quantum System Dashboard</h1>
         <section>
           <h2>Metrics</h2>
           <pre id="metrics"></pre>
         </section>
         <section>
           <h2>Grafana Visualization</h2>
           <iframe
             src="https://grafana.example.com/d/XYZ/quantum-metrics"
             width="100%"
             height="600"
             frameBorder="0"
             allowFullScreen
           ></iframe>
         </section>
       </main>
     );
   }
   ```

2. Create a Next.js API route to proxy Prometheus:
   - `client/pages/api/metrics.js`:
     ```js
     export default async function handler(req, res) {
       const r = await fetch('http://localhost:3000/metrics');
       const metrics = await r.text();
       res.setHeader('Content-Type', 'text/plain');
       res.status(200).send(metrics);
     }
     ```

### 2. Secure the Dashboard

1. Install authentication module (e.g. `next-auth` or custom Keycloak integration):
   ```sh
   npm install next-auth
   ```
2. Protect the dashboard route:
   - Use `getServerSideProps` to check auth or wrap the page in `<SessionProvider>`.

### 3. HTTPS Setup

- In production, enforce HTTPS by setting up reverse proxy (Caddy/nginx).
- In `next.config.js`:
  ```js
  module.exports = {
    async redirects() {
      return [
        {
          source: '/:path*',
          has: [{ type: 'header', key: 'x-forwarded-proto', value: 'http' }],
          destination: 'https://yourdomain.com/:path*',
          permanent: true,
        },
      ];
    },
  };
  ```

### 4. Styling and Usability

- Use Tailwind or Chakra for styling.
- Add loading/error states on metrics fetch.
- Include color-coded status badges for SLOs.

---

## Verification

- Run `npm run dev` in `client/` and open `/dashboard`.
- Metrics are fetched and rendered (try with and without Prometheus backend up).
- Grafana iframe loads correct dashboard.
- Login required for access (test public and private routes).
- Run `lighthouse` audit for accessibility.

---

## Rollback / Troubleshooting

- If API route fails, check proxy target, CORS, and server logs.
- Fallback to static dashboard or revert to previous commit.
- If login breaks, temporarily disable auth for debug (remove middleware).

---

## Time Estimate

01:00

---

## Owner / JIRA

- Owner: Frontend Lead (update upon assignment)
- JIRA: Q5-5.4