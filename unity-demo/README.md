Unity 6.2 Demo – AI Director Live Quest + Mint

Overview
- Connects to your backend at `/ws/game`.
- Shows a unique, signed quest (seed + sigil + hash), companion mood updates, and an item mint payload on completion.

Prereqs
- Unity 6.x (tested with 6.2)
- Packages:
  - NativeWebSocket (WebGL + Desktop): https://github.com/endel/NativeWebSocket – install via UPM (Add package from git URL) or import .unitypackage
  - Newtonsoft JSON for Unity: Use Unity’s official package `com.unity.nuget.newtonsoft-json` via Package Manager

Setup
1) Backend
   - In repo root: `npm run start:game-demo`
   - Verify: open http://localhost:5000/game-demo.html to see the browser demo working.

2) Unity Scene
   - Create an empty GameObject `GameClient` and add the `GameClient.cs` script.
   - Create a simple Canvas (Screen Space - Overlay) with Text objects for:
     - Connection: connState, tickHz, coherence, resonance
     - Quest: questTitle, questSeed, questSigil, questSig
     - Objective: questObj
     - Companion: mood, bond
     - Mint: tokenId, mintJson
   - Create Buttons and wire to GameClient fields: btnConnect, btnDisconnect, btnAccept, btnComplete, btnNew.
   - Assign all references in the inspector.

3) Run
   - Play Mode → Press Connect (auto connects by default if desired).
   - Accept Quest → then Complete Quest → mint panel updates.
   - Press New Run to fetch a different unique quest (see seed/sigil change).

Notes
- WebGL requires NativeWebSocket (System.Net.WebSockets is not supported in WebGL).
- PC/macOS standalone also works with NativeWebSocket.
- For remote demos, change the WebSocket URL in `GameClient.cs` WsUrl property to point to your host.

