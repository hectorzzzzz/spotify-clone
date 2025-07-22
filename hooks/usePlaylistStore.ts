import { create } from "zustand"

interface Playlist {
    id: string;
    name: string;
    desc: string;
    image_path: string;
}

interface PlaylistStore {
    playlists: Playlist[];
    setPlaylists: (playlists: Playlist[]) => void;
    addPlaylist: (playlist: Playlist) => void;
}

export const usePlaylistStore = create <PlaylistStore>((set) => ({
    playlists: [],
    setPlaylists: (playlists) => set({ playlists }),
    addPlaylist: (playlist) => 
        set((state) => ({
            playlists: [playlist, ...state.playlists],
        }))
}));