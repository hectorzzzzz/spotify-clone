"use client"

import { Song, Playlist } from "@/types"
import SongItem from "./SongItem";
import useOnPlay from "@/hooks/useOnPlay";
import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { toast } from "react-hot-toast"

interface PageContentProps {
    songs: Song[];
}

const PageContent: React.FC<PageContentProps> = ({
    songs
}) => {
    const onPlay = useOnPlay(songs);
    const supabase = createClientComponentClient();
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [playlistSongs, setPlaylistSongs] = useState<
    { playlist_id: string; song_id: string }[]>([]);

    useEffect (() => {
        const getPlaylist = async () => {
            const { data, error } = await supabase
                .from("playlists")
                .select("*");

            if (!error && data) {
                setPlaylists(data);
            }

            const { data: playlistSongsData, error: playlistSongsError } = await supabase
                .from("playlist_songs")
                .select("playlist_id, song_id");
            
            if (!playlistSongsError && playlistSongsData) {
                setPlaylistSongs(playlistSongsData)
            }
        }

        getPlaylist();
    }, [supabase]);

    const handleAddToPlaylist = async (playlistId: string, songId: string) => {
        
        const isDuplicate = playlistSongs.some(
            (ps) => ps.playlist_id === playlistId && ps.song_id === songId
        );

        const playlistName =
            playlists.find((p) => p.id === playlistId)?.name || "this playlist";

        if (isDuplicate) {
            toast.error(`This song already in ${playlistName}`);
            return;
        }

        const {
            data: { user },
            error: userError,
        } = await supabase.auth.getUser();
    
        if (userError || !user) {
            toast.error("User not found. Please log in.");
            return;
        }

        const { error } = await supabase
            .from("playlist_songs")
            .insert([{ playlist_id: playlistId, song_id: songId, user_id: user.id}]);

        if (error) {
            console.error("Add failed:", error);
            toast.error("Failed to add a song")
        } else {
            toast.success("Song added!")
            setPlaylistSongs((prev) => [
                ...prev,
                { playlist_id: playlistId, song_id: songId },
            ]);
        }
    }
    
    if (songs.length === 0) {
        return (
            <div className="mt-4 text-neutral-400">
                No Songs available.
            </div>
        )
    }
    return (
        <div
            className="
                grid
                grid-cols-2
                sm:grid-cols-3
                md:grid-cols-3
                lg:grid-cols-4
                xl:grid-cols-5
                2xl:grid-cols-8
                gap-4
                mt-4
            "
        >
            {songs.map((item) => (
                <SongItem
                    key={`${item.id}-${item.title}`}
                    playlists={playlists}
                    onAddToPlaylist={handleAddToPlaylist}
                    onClick={(id: string) => onPlay(id)}
                    data={item}
                /> 
            ))}
        </div>
    );
}

export default PageContent;

