import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Song } from "@/types";

export const getPlaylistSongs = async (playlistId: string): Promise<Song[]> => {
    const supabase = createServerComponentClient({
        cookies: cookies
    });

    const { data, error } = await supabase
        .from('playlist_songs')
        .select('*, songs(*)')
        .eq("playlist_id", playlistId)
        .order('created_at', { ascending: false});
    
        if (error) {
            console.log(error);
            return[];
        }
    
        return data.map((item) => ({
            ...item.songs
        }))
}

export default getPlaylistSongs;