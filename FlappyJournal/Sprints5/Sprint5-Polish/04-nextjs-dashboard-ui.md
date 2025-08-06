> Status: Complete

# 04 – Next.js Dashboard UI

**Objective:**  
Build and deploy a secure, real-time Next.js dashboard for quantum metrics, including live Prometheus stats,
Grafana visualizations, and authenticated access.

**Why it matters:**  
Gives both devs and SREs a single pane of glass for system health, performance, and incident response.

---

## Preconditions

- Next.js v14+ app in `client/`
  ```sh
  npx create-next-app@latest client
  ```
- Tailwind CSS installed:
  ```sh
  cd client
  npx tailwindcss init -p
  npm install tailwindcss@latest postcss@latest autoprefixer@latest recharts swr
  ```
- Prometheus `/metrics` endpoint live (e.g. `http://localhost:3000/metrics`)
- Grafana dashboard published (e.g. `https://grafana.example.com/d/XYZ/quantum-metrics`)
- Auth provider (Keycloak, Auth0, or NextAuth) with credentials
- HTTPS configured for prod

---

## Procedure

### 1. Set Up Tailwind and Base Style

**File:** `client/tailwind.config.js`
```js
module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: { extend: {} },
  plugins: [],
};
```
**File:** `client/pages/_app.js`
```js
import '../styles/globals.css'
export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />
}
```

### 2. Secure the Dashboard with Auth

**Install NextAuth with Keycloak adapter:**
```sh
npm install next-auth @next-auth/keycloak
```

**File:** `client/pages/api/auth/[...nextauth].js`
```js
import NextAuth from "next-auth";
import KeycloakProvider from "next-auth/providers/keycloak";
export default NextAuth({
  providers: [
    KeycloakProvider({
      clientId: process.env.KEYCLOAK_CLIENT_ID,
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET,
      issuer: process.env.KEYCLOAK_ISSUER,
    }),
  ],
});
```

**Protect dashboard with `getServerSideProps`:**
```js
import { getSession } from "next-auth/react";
export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session) {
    return { redirect: { destination: '/api/auth/signin', permanent: false } };
  }
  return { props: {} };
}
```

### 3. Add `/api/metrics` Proxy Route

**File:** `client/pages/api/metrics.js`
```js
export default async function handler(req, res) {
  const r = await fetch('http://localhost:3000/metrics');
  const metrics = await r.text();
  res.setHeader('Content-Type', 'text/plain');
  res.status(200).send(metrics);
}
```

### 4. Build Dashboard Page with SWR + Recharts

**File:** `client/pages/dashboard.js`
```jsx
import useSWR from 'swr';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const fetcher = url => fetch(url).then(r => r.text());

function parsePrometheusMetrics(text) {
  // Simple extraction for quantum_field_process_latency_ms histogram
  const lines = text.split('\n');
  const latency = [];
  for (const l of lines) {
    if (l.startsWith('quantum_field_process_latency_ms_bucket')) {
      const match = l.match(/le="([^"]+)".*} (\d+)/);
      if (match)
        latency.push({ bucket: match[1], count: Number(match[2]) });
    }
  }
  return latency;
}

export default function Dashboard() {
  const { data, error } = useSWR('/api/metrics', fetcher, { refreshInterval: 5000 });
  const latency = data ? parsePrometheusMetrics(data) : [];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-4">Quantum System Dashboard</h1>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Field Process Latency (ms)</h2>
        <div className="w-full h-64 bg-white rounded shadow">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={latency}>
              <XAxis dataKey="bucket" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#2563eb" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-2">Grafana Visualization</h2>
        <iframe
          src="https://grafana.example.com/d/XYZ/quantum-metrics"
          width="100%"
          height="600"
          frameBorder="0"
          allowFullScreen
          className="rounded shadow"
        ></iframe>
      </section>
    </div>
  );
}
```

---

## Verification

- `npm run dev` and visit `/dashboard`: see live latency chart and Grafana panel.
- If not logged in, redirected to Keycloak/NextAuth login.
- Metrics auto-refresh every 5 seconds.
- Lighthouse passes accessibility checks (run: `npx lighthouse http://localhost:3000/dashboard`).

---

## Rollback / Troubleshooting

- If `/api/metrics` fails, check Prometheus is running and CORS is allowed.
- If charts are empty, check metric name with `curl localhost:3000/metrics`.
- To debug auth, check `.env` and NextAuth logs.

---

## Time Estimate

01:00

---

## Owner / JIRA

- Owner: Frontend Lead
- JIRA: Q5-5.4