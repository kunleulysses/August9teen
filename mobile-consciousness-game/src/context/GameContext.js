import React, { createContext, useContext, useEffect, useMemo, useReducer, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ConsciousnessService from '../services/ConsciousnessService';

const STORAGE_KEY = 'cc_game_state_v1';

const initialState = {
  player: {
    id: null,
    username: 'You',
    level: 1,
    coins: 0,
    inventory: [
      { id: 'apple', name: 'Apple', type: 'food', quantity: 3 },
      { id: 'ball', name: 'Ball', type: 'toy', quantity: 1 },
    ],
  },
  companion: {
    id: null,
    name: 'Nyx',
    level: 1,
    experience: 0,
    mood: 'neutral',
    hunger: 50,
    energy: 50,
    happiness: 50,
    accessories: [],
    personality: {
      playfulness: 0.6,
      curiosity: 0.7,
      loyalty: 0.6,
      intelligence: 0.5,
    },
  },
  world: {
    currentArea: 'town',
    weather: 'sunny',
    timeOfDay: 'day',
    discoveredAreas: ['town'],
    activeEvents: [],
  },
  ui: {
    currentScreen: 'home',
    showNotification: false,
    notificationMessage: '',
  },
  consciousness: {
    isConnected: false,
    lastHeartbeat: null,
  },
  sanctuary: {
    level: 1,
    xp: 0,
    ascended: false,
    legendary: false,
  },
  journal: {
    memories: [],
  },
  logs: {
    moduleStatus: [],
    actions: [],
    ai: [],
  },
  presence: {
    nearby: [],
  },
  ladder: {
    list: [],
  },
  assets: {
    manifest: null,
  },
  fx: {
    active: [],
  },
};

function clamp(v, min = 0, max = 100) {
  return Math.max(min, Math.min(max, v));
}

function gameReducer(state, action) {
  switch (action.type) {
    case 'LOAD_STATE':
      return { ...state, ...action.payload };

    case 'SET_CONNECTED':
      return {
        ...state,
        consciousness: { ...state.consciousness, isConnected: action.value },
      };

    case 'SET_SCREEN':
      return { ...state, ui: { ...state.ui, currentScreen: action.screen } };

    case 'SHOW_NOTIFICATION':
      return {
        ...state,
        ui: { ...state.ui, showNotification: true, notificationMessage: action.message },
      };

    case 'HIDE_NOTIFICATION':
      return { ...state, ui: { ...state.ui, showNotification: false, notificationMessage: '' } };

    case 'SET_INITIAL_STATE': {
      const { player, companion, world, consciousness, sanctuary } = action.payload || {};
      return {
        ...state,
        player: player ? { ...state.player, ...player } : state.player,
        companion: companion ? { ...state.companion, ...companion } : state.companion,
        world: world ? { ...state.world, ...world } : state.world,
        sanctuary: sanctuary ? { ...state.sanctuary, ...sanctuary } : state.sanctuary,
        consciousness: {
          ...state.consciousness,
          ...(consciousness ? { lastHeartbeat: Date.now(), isConnected: true } : {}),
          isConnected: true,
        },
      };
    }

    case 'UPDATE_COMPANION': {
      const next = { ...state.companion, ...action.patch };
      next.hunger = clamp(next.hunger);
      next.energy = clamp(next.energy);
      next.happiness = clamp(next.happiness);
      return { ...state, companion: next };
    }

    case 'WORLD_EVENT': {
      const { area, encounter } = action.payload || {};
      const world = { ...state.world };
      if (area && !world.discoveredAreas.includes(area)) {
        world.discoveredAreas = [...world.discoveredAreas, area];
      }
      if (encounter) {
        world.activeEvents = [...world.activeEvents, encounter];
      }
      return { ...state, world };
    }

    case 'GLOBAL_EVENT': {
      const world = { ...state.world };
      world.activeEvents = [...world.activeEvents, action.payload];
      return { ...state, world };
    }

    case 'HEARTBEAT': {
      return {
        ...state,
        consciousness: {
          ...state.consciousness,
          lastHeartbeat: action.payload,
          isConnected: true,
        },
      };
    }

    case 'SANCTUARY_STATE':
      return { ...state, sanctuary: { ...state.sanctuary, ...action.payload } };

    case 'DECREMENT_INVENTORY': {
      const { itemId, delta } = action;
      const inv = state.player.inventory.map((it) =>
        it.id === itemId ? { ...it, quantity: Math.max(0, (it.quantity || 0) - Math.abs(delta)) } : it
      );
      return { ...state, player: { ...state.player, inventory: inv } };
    }

    case 'SET_PLAYER':
      return { ...state, player: { ...state.player, ...action.patch } };

    case 'ADD_MEMORIES': {
      const items = Array.isArray(action.items) ? action.items : [];
      const existing = state.journal.memories || [];
      return { ...state, journal: { ...state.journal, memories: [...items, ...existing].slice(0, 50) } };
    }

    case 'LOG_MODULE_STATUS': {
      const list = state.logs.moduleStatus.slice(-49);
      list.push(action.payload);
      return { ...state, logs: { ...state.logs, moduleStatus: list } };
    }

    case 'LOG_ACTION': {
      const list = state.logs.actions.slice(-49);
      list.push({ ts: Date.now(), ...action.payload });
      return { ...state, logs: { ...state.logs, actions: list } };
    }

    case 'LOG_AI': {
      const list = state.logs.ai.slice(-49);
      list.push({ ts: Date.now(), ...action.payload });
      return { ...state, logs: { ...state.logs, ai: list } };
    }

    case 'SET_NEARBY': {
      const p = Array.isArray(action.players) ? action.players : [];
      return { ...state, presence: { ...state.presence, nearby: p } };
    }

    case 'SET_LADDER': {
      const list = Array.isArray(action.list) ? action.list : [];
      return { ...state, ladder: { ...state.ladder, list } };
    }

    case 'SET_ASSETS': {
      return { ...state, assets: { ...state.assets, manifest: action.manifest || null } };
    }

    case 'ADD_FX': {
      const fx = action.fx;
      const list = (state.fx.active || []).slice(-9);
      list.push(fx);
      return { ...state, fx: { ...state.fx, active: list } };
    }

    case 'CLEAR_FX': {
      const list = (state.fx.active || []).filter(x => x.id !== action.id);
      return { ...state, fx: { ...state.fx, active: list } };
    }

    default:
      return state;
  }
}

const GameContext = createContext({ state: initialState, actions: {} });

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const saveTimer = useRef(null);
  const lastHBRef = useRef(0);
  const setAssetsRef = useRef(null);

  // Load persisted state
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          dispatch({ type: 'LOAD_STATE', payload: parsed });
        }
      } catch {}
    })();
  }, []);

  // Persist state lightly debounced
  useEffect(() => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => {});
    }, 400);
    return () => saveTimer.current && clearTimeout(saveTimer.current);
  }, [state]);

  // Wire WS → state
  useEffect(() => {
    // Expose a global hook to set assets manifest (loaded in App.js)
    try { global.__setGameAssets = (m) => dispatch({ type: 'SET_ASSETS', manifest: m }); } catch {}
    function onInitial(payload) {
      dispatch({ type: 'SET_INITIAL_STATE', payload });
    }
    function onMoodChange(payload) {
      dispatch({ type: 'UPDATE_COMPANION', patch: { ...payload.stats, mood: payload.mood } });
    }
    function onWorldEvent(payload) {
      dispatch({ type: 'WORLD_EVENT', payload });
    }
    function onWorldGlobal(payload) {
      dispatch({ type: 'GLOBAL_EVENT', payload });
    }
    function onGeneratedEncounter(payload) {
      dispatch({ type: 'GLOBAL_EVENT', payload });
      // Ensure we return to idle after movement
      dispatch({ type: 'UPDATE_COMPANION', patch: { mood: 'idle' } });
    }
    function onWorldFx(payload) {
      const effect = payload?.effect || {};
      const id = `fx_${Date.now().toString(36)}_${Math.random().toString(36).slice(2,6)}`;
      const durationMs = typeof effect.durationMs === 'number' ? effect.durationMs : 1500;
      dispatch({ type: 'ADD_FX', fx: {
        id,
        type: effect.type || 'resonance',
        color: effect.color || '#9B59B6',
        amplitude: typeof effect.amplitude === 'number' ? effect.amplitude : 0.8,
        durationMs,
        ts: Date.now(),
      }});
      dispatch({ type: 'GLOBAL_EVENT', payload: { ...payload, fx: true } });
      actions.showNotification('💥 Resonant effect triggered');
      setTimeout(() => dispatch({ type: 'CLEAR_FX', id }), durationMs + 100);
    }
    function onHeartbeat(payload) {
      const now = Date.now();
      if (now - lastHBRef.current > 1000) { // throttle to ~1 Hz
        lastHBRef.current = now;
        dispatch({ type: 'HEARTBEAT', payload });
      }
    }
    function onOpen() { dispatch({ type: 'SET_CONNECTED', value: true }); }
    function onClose() { dispatch({ type: 'SET_CONNECTED', value: false }); }
    function onMemories(payload) {
      const items = payload?.items || [];
      dispatch({ type: 'ADD_MEMORIES', items });
    }
    function onModuleStatus(payload) { dispatch({ type: 'LOG_MODULE_STATUS', payload }); }
    function onAiResp(payload) { dispatch({ type: 'LOG_AI', payload: { kind: 'ai', payload } }); }
    function onSanctuary(payload) { dispatch({ type: 'SANCTUARY_STATE', payload }); }
    function onAbilityResult(payload) {
      if (payload?.ok) {
        if (payload?.stats) dispatch({ type: 'UPDATE_COMPANION', patch: payload.stats });
        if (payload?.buffs) dispatch({ type: 'UPDATE_COMPANION', patch: { buffs: payload.buffs } });
        actions.showNotification('✨ Ability activated');
      } else {
        actions.showNotification('⏳ Ability not ready');
      }
    }
    function onBattleMatch(payload) { actions.showNotification('⚔️ Match found!'); dispatch({ type: 'LOG_ACTION', payload: { kind: 'battle_match', payload } }); }
    function onBattleResult(payload) {
      actions.showNotification(payload.isWinner ? '🏆 You won the battle!' : '⚔️ You lost the battle');
      dispatch({ type: 'LOG_ACTION', payload: { kind: 'battle_result', payload } });
    }
    function onNearbyPlayers(payload) {
      const players = Array.isArray(payload?.players) ? payload.players : [];
      dispatch({ type: 'LOG_ACTION', payload: { kind: 'nearby_players', payload } });
      dispatch({ type: 'SET_NEARBY', players });
    }
    function onBattleChallenge(payload) { actions.showNotification('⚔️ Challenge received'); dispatch({ type: 'LOG_ACTION', payload: { kind: 'battle_challenge', payload } }); }
    function onBattleDeclined(payload) { actions.showNotification('❌ Challenge declined'); dispatch({ type: 'LOG_ACTION', payload: { kind: 'battle_declined', payload } }); }
    function onChallengeSent(payload) { actions.showNotification('📨 Challenge sent'); dispatch({ type: 'LOG_ACTION', payload: { kind: 'battle_challenge_sent', payload } }); }
    function onLadderList(payload) { const list = payload?.list || []; dispatch({ type: 'SET_LADDER', list }); saveTrend(list).catch(() => {}); }

    async function saveTrend(list) {
      try {
        const me = state.player?.id;
        if (!me || !Array.isArray(list) || list.length === 0) return;
        const idx = list.findIndex((x) => x.playerId === me);
        const meEntry = idx >= 0 ? list[idx] : null;
        if (!meEntry) return;
        const snapshot = { ts: Date.now(), rank: idx + 1, sanctuaryLevel: meEntry.sanctuaryLevel || 1 };
        const raw = await AsyncStorage.getItem('cc_ladder_trends');
        const arr = raw ? JSON.parse(raw) : [];
        arr.push(snapshot);
        while (arr.length > 60) arr.shift(); // cap
        await AsyncStorage.setItem('cc_ladder_trends', JSON.stringify(arr));
      } catch {}
    }

    ConsciousnessService.on('game:initial_state', onInitial);
    ConsciousnessService.on('companion:mood_change', onMoodChange);
    ConsciousnessService.on('world:event', onWorldEvent);
    ConsciousnessService.on('world:global_event', onWorldGlobal);
    ConsciousnessService.on('world:generated_encounter', onGeneratedEncounter);
    ConsciousnessService.on('world:fx', onWorldFx);
    ConsciousnessService.on('consciousness:heartbeat', onHeartbeat);
    ConsciousnessService.on('consciousness:module:status', onModuleStatus);
    ConsciousnessService.on('companion:memories', onMemories);
    ConsciousnessService.on('ai:holistic_response', onAiResp);
    ConsciousnessService.on('companion:ai_message', onAiResp);
    ConsciousnessService.on('sanctuary:state', onSanctuary);
    ConsciousnessService.on('sanctuary:ascended', onSanctuary);
    ConsciousnessService.on('ability:result', onAbilityResult);
    ConsciousnessService.on('battle:match_found', onBattleMatch);
    ConsciousnessService.on('battle:result', onBattleResult);
    ConsciousnessService.on('world:nearby_players', onNearbyPlayers);
    ConsciousnessService.on('battle:challenge', onBattleChallenge);
    ConsciousnessService.on('battle:declined', onBattleDeclined);
    ConsciousnessService.on('battle:challenge_sent', onChallengeSent);
    ConsciousnessService.on('ladder:list', onLadderList);
    ConsciousnessService.on('__open__', onOpen);
    ConsciousnessService.on('__close__', onClose);

    return () => {
      ConsciousnessService.off('game:initial_state', onInitial);
      ConsciousnessService.off('companion:mood_change', onMoodChange);
      ConsciousnessService.off('world:event', onWorldEvent);
      ConsciousnessService.off('world:global_event', onWorldGlobal);
      ConsciousnessService.off('world:generated_encounter', onGeneratedEncounter);
      ConsciousnessService.off('world:fx', onWorldFx);
      ConsciousnessService.off('consciousness:heartbeat', onHeartbeat);
      ConsciousnessService.off('consciousness:module:status', onModuleStatus);
      ConsciousnessService.off('companion:memories', onMemories);
      ConsciousnessService.off('ai:holistic_response', onAiResp);
      ConsciousnessService.off('companion:ai_message', onAiResp);
      ConsciousnessService.off('sanctuary:state', onSanctuary);
      ConsciousnessService.off('sanctuary:ascended', onSanctuary);
      ConsciousnessService.off('ability:result', onAbilityResult);
      ConsciousnessService.off('battle:match_found', onBattleMatch);
      ConsciousnessService.off('battle:result', onBattleResult);
      ConsciousnessService.off('world:nearby_players', onNearbyPlayers);
      ConsciousnessService.off('battle:challenge', onBattleChallenge);
      ConsciousnessService.off('battle:declined', onBattleDeclined);
      ConsciousnessService.off('battle:challenge_sent', onChallengeSent);
      ConsciousnessService.off('ladder:list', onLadderList);
      ConsciousnessService.off('__open__', onOpen);
      ConsciousnessService.off('__close__', onClose);
    };
  }, []);

  const actions = useMemo(() => ({
    setScreen: (screen) => dispatch({ type: 'SET_SCREEN', screen }),
    showNotification: (message) => {
      dispatch({ type: 'SHOW_NOTIFICATION', message });
      setTimeout(() => dispatch({ type: 'HIDE_NOTIFICATION' }), 2000);
    },
    updateCompanion: (patch) => dispatch({ type: 'UPDATE_COMPANION', patch }),

    feedCompanion: (foodType = 'apple') => {
      // Optimistic local changes
      dispatch({ type: 'DECREMENT_INVENTORY', itemId: foodType, delta: 1 });
      // Server event
      ConsciousnessService.feedCompanion(foodType);
      dispatch({ type: 'LOG_ACTION', payload: { kind: 'feed', foodType } });
    },

    playWithCompanion: (gameType = 'ball') => {
      ConsciousnessService.playWithCompanion(gameType);
      dispatch({ type: 'LOG_ACTION', payload: { kind: 'play', gameType } });
    },

    exploreArea: (areaName) => {
      // Local explore UX: walk vs run depending on change
      const prevMood = state.companion?.mood || 'idle';
      const curArea = state.world?.currentArea;
      const isLongMove = curArea && curArea !== areaName;
      dispatch({ type: 'WORLD_EVENT', payload: { area: areaName } });
      dispatch({ type: 'UPDATE_COMPANION', patch: { mood: isLongMove ? 'run' : 'walk' } });
      setTimeout(() => dispatch({ type: 'UPDATE_COMPANION', patch: { mood: prevMood === 'neutral' ? 'idle' : prevMood } }), isLongMove ? 1800 : 1200);
      ConsciousnessService.exploreArea(areaName);
      dispatch({ type: 'LOG_ACTION', payload: { kind: 'explore', area: areaName } });
    },

    requestMemories: () => ConsciousnessService.requestMemories(),

    // Sanctuary
    getSanctuary: () => ConsciousnessService.getSanctuary(),
    ascendSanctuary: () => ConsciousnessService.ascendSanctuary(),

    // PvP / Presence
    listNearbyPlayers: () => ConsciousnessService.listNearbyPlayers(),
    joinBattleQueue: () => ConsciousnessService.joinBattleQueue(),
    leaveBattleQueue: () => ConsciousnessService.leaveBattleQueue(),
    challengeOpponent: (opponentSessionId) => ConsciousnessService.challengeOpponent(opponentSessionId),
    acceptBattle: () => ConsciousnessService.acceptBattle(),
    declineBattle: () => ConsciousnessService.declineBattle(),

    // Ladder
    requestLadder: () => ConsciousnessService.requestLadder(),

    // Abilities
    useAbility: (abilityId) => ConsciousnessService.useAbility(abilityId),
  }), []);

  const value = useMemo(() => ({ state, actions }), [state, actions]);

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  return useContext(GameContext);
}

export default GameContext;
