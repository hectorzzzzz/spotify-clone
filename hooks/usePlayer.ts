import { create } from "zustand";

type RepeatMode = "off" | "repeat_all" | "repeat_one";

interface PlayerStore {
    ids: string [];
    activeId?: string;
    isShuffle: boolean;
    repeatMode: RepeatMode;
    setId: (id: string) => void;
    setIds: (ids: string []) => void;
    reset: () => void;
    toggleShuffle: () => void;
    cycleRepeatMode: () => void;
};

const usePlayer = create<PlayerStore>((set) => ({
    ids: [],
    activeId: undefined,
    isShuffle: false,
    repeatMode: "off",
    setId: (id: string) => set ({ activeId: id}),
    setIds: (ids: string[]) => set ({ ids: ids }),
    toggleShuffle: () => set((state) => ({ isShuffle: !state.isShuffle })),
    reset: () => set((state) => ({
        ...state,
        ids: [],
        activeId: undefined,
    })),
    cycleRepeatMode: () => set((state) => {
        const modes: RepeatMode [] = ["off", "repeat_all", "repeat_one"];
        const nextIndex = (modes.indexOf(state.repeatMode) + 1) % modes.length;
        return { repeatMode: modes[nextIndex] };
    })
}));

export default usePlayer;