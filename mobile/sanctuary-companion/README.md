# Sanctuary Companion (Expo, iOS/Android)

Text-only Sanctuary + Companion app. Streams moments via WebSocket and persists journal entries.

Quick start
- cd mobile/sanctuary-companion
- Update app.json extra.apiUrl and extra.wssUrl
- yarn (or npm i)
- npx expo start
- npx expo run:ios | npx expo run:android

Config
- app.json -> expo.extra
  - apiUrl: https://your-api
  - wssUrl: wss://your-api/ws/unified-chat
  - auth.issuer: OIDC issuer (Keycloak)
  - auth.clientId: public mobile client
  - auth.redirectScheme: sanctuary

How it works
- Auth: Expo AuthSession (PKCE) stores access token in SecureStore
- WS: token sent via Sec-WebSocket-Protocol subprotocol
- REST: Authorization: Bearer <token>
- Screens: Sanctuary (feed), Companion (chat + evolution), Journal (entries)

Notes
- This project is mobile-only (iOS/Android). Web is disabled via platforms in app.json.
- Ensure backend WS path accepts the token as subprotocol and enforces aud/iss.
