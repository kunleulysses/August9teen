using System;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq; // Install "com.unity.nuget.newtonsoft-json" via Package Manager
using NativeWebSocket;      // Install NativeWebSocket (recommended) for WebGL + Desktop
using UnityEngine;
using UnityEngine.UI;

public class GameClient : MonoBehaviour
{
    [Header("UI References")] public Text connState;
    public Text tickHz; public Text coherence; public Text resonance;
    public Text questTitle; public Text questSeed; public Text questSigil; public Text questSig; public Text questObj;
    public Text mood; public Text bond; public Text tokenId; public Text mintJson;

    [Header("Buttons")] public Button btnConnect; public Button btnDisconnect; public Button btnAccept; public Button btnComplete; public Button btnNew;

    private WebSocket ws;
    private string currentQuestId;

    private string WsUrl => (Application.isEditor ? "ws://localhost:5000/ws/game" : $"ws://{Application.absoluteURL}/ws/game");

    private void Awake()
    {
        btnConnect.onClick.AddListener(Connect);
        btnDisconnect.onClick.AddListener(() => { if (ws != null) ws.Close(); });
        btnAccept.onClick.AddListener(() => SendJson(new JObject { ["type"] = "quest:accept", ["questId"] = currentQuestId }));
        btnComplete.onClick.AddListener(() => SendJson(new JObject { ["type"] = "quest:complete", ["questId"] = currentQuestId }));
        btnNew.onClick.AddListener(() => SendJson(new JObject { ["type"] = "quest:new" }));
        SetButtons(false);
        SetConn("disconnected");
    }

    private async void Connect()
    {
        if (ws != null && ws.State == WebSocketState.Open) return;
        ws = new WebSocket(WsUrl);
        ws.OnOpen += () => {
            SetConn("connected");
            btnConnect.interactable = false; btnDisconnect.interactable = true;
        };
        ws.OnClose += _ => {
            SetConn("disconnected");
            btnConnect.interactable = true; btnDisconnect.interactable = false;
            SetButtons(false);
        };
        ws.OnError += (err) => Debug.LogError($"WS error: {err}");
        ws.OnMessage += (bytes) => {
            var msg = Encoding.UTF8.GetString(bytes);
            Handle(msg);
        };
        await ws.Connect();
    }

    private async void SendJson(JObject obj)
    {
        if (ws == null || ws.State != WebSocketState.Open) return;
        await ws.SendText(obj.ToString());
    }

    private void Handle(string json)
    {
        try
        {
            var root = JObject.Parse(json);
            var type = root.Value<string>("type");
            switch (type)
            {
                case "director:state":
                    tickHz.text = root.Value<int?>("tickHz")?.ToString() ?? "—";
                    coherence.text = root.Value<float?>("coherence")?.ToString("0.000") ?? "—";
                    resonance.text = root.Value<float?>("resonance")?.ToString("0.000") ?? "—";
                    break;
                case "director:tick":
                    var state = root["state"] as JObject;
                    if (state != null)
                    {
                        coherence.text = state.Value<float?>("coherence")?.ToString("0.000") ?? coherence.text;
                        resonance.text = state.Value<float?>("resonance")?.ToString("0.000") ?? resonance.text;
                    }
                    break;
                case "quest:offer":
                    var q = root["quest"] as JObject;
                    currentQuestId = q?.Value<string>("id");
                    questTitle.text = q?.Value<string>("title") ?? "—";
                    questSeed.text = q?.Value<string>("seed") ?? "—";
                    questSigil.text = q?.Value<string>("sigil") ?? "—";
                    questSig.text = q?["provenance"]?.Value<string>("signature") ?? "—";
                    var obj = q?["objectives"]?[0] as JObject;
                    if (obj != null)
                    {
                        var kind = obj.Value<string>("kind");
                        var target = obj.Value<string>("target");
                        var count = obj.Value<int?>("count");
                        var hint = obj.Value<string>("hint");
                        questObj.text = $"{kind} {count} {target} ({hint})";
                    }
                    SetButtons(true);
                    break;
                case "npc:spawn":
                    // Could instantiate prefab here; for demo we just log
                    Debug.Log($"NPC: {root["npc"]? ["name"]} – {root["npc"]?["hint"]}");
                    break;
                case "companion:update":
                    mood.text = root.Value<string>("mood") ?? "—";
                    bond.text = root.Value<float?>("bond")?.ToString("0.00") ?? "—";
                    break;
                case "item:minted":
                    tokenId.text = root.Value<string>("tokenId") ?? "—";
                    mintJson.text = (root["metadata"] as JObject)?.ToString() ?? "—";
                    break;
            }
        }
        catch (Exception e)
        {
            Debug.LogError($"Parse error: {e.Message}\n{json}");
        }
    }

    private void Update()
    {
#if !UNITY_WEBGL || UNITY_EDITOR
        ws?.DispatchMessageQueue();
#endif
    }

    private async void OnApplicationQuit()
    {
        if (ws != null) await ws.Close();
    }

    private void SetConn(string s) { if (connState) connState.text = s; }
    private void SetButtons(bool enabled)
    {
        if (btnAccept) btnAccept.interactable = enabled;
        if (btnComplete) btnComplete.interactable = enabled;
        if (btnNew) btnNew.interactable = enabled;
    }
}

