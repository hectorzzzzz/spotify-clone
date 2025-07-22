import { useSupabaseClient } from "@supabase/auth-helpers-react"
import { Playlist } from "@/types";


const useLoadImagePlaylist = (playlist?: Playlist | null | undefined) => {
    const supabaseClient = useSupabaseClient();

    if (!playlist?.image_path) {
        return null;
    }

    const { data } = supabaseClient
        .storage
        .from('images')
        .getPublicUrl(playlist.image_path);

    return data?.publicUrl ?? null;
};

export default useLoadImagePlaylist;