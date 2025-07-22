import { create } from "zustand";
import { Playlist, Song } from "@/types";

interface Position {
  top: number;
  left: number;
}

interface DropdownModalStore {
  isOpen: boolean;
  song: Song | null;
  playlists: Playlist[];
  position: Position | null
  onAddToPlaylist: (playlistId: string, songId: string) => void;
  onOpen: (song: Song, playlists: Playlist[], position: Position, onAddToPlaylist: (playlistId: string, songId: string) => void) => void;
  onClose: () => void;
}

export const useDropdownModal = create<DropdownModalStore>((set) => ({
  isOpen: false,
  song: null,
  playlists: [],
  position: null,
  onAddToPlaylist: () => {},
  onOpen: (song, playlists, position, onAddToPlaylist) =>
    set({ isOpen: true, song, playlists, position, onAddToPlaylist: (playlistId, songId) => onAddToPlaylist(playlistId, songId) }),
  onClose: () =>
    set({ isOpen: false, song: null, playlists: [], position: null, onAddToPlaylist: () => {} }),
}));