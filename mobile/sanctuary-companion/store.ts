import { create } from 'zustand';

type Moment = { id: string; ts: number; text: string; tags?: string[] };
type Journal = { id: string | number; ts: number; title?: string; content: string };

type State = {
  jwt?: string;
  feed: Moment[];
  journal: Journal[];
  setJwt: (t?: string) => void;
  addMoment: (m: Moment) => void;
  addJournalFromMoment: (m: Moment) => void;
};

export const useStore = create<State>((set) => ({
  jwt: undefined,
  feed: [],
  journal: [],
  setJwt: (t) => set({ jwt: t }),
  addMoment: (m) => set((s) => ({ feed: [m, ...s.feed].slice(0, 200) })),
  addJournalFromMoment: (m) =>
    set((s) => ({ journal: [{ id: m.id, ts: m.ts, title: 'Moment', content: m.text }, ...s.journal] }))
}));

