import { Playlist } from "@/types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";


const getPlaylistById = async (playlistId: string): Promise<Playlist | null> => {
    const supabase = createServerComponentClient({
        cookies: cookies
    });

    const { 
        data: sessionData, 
        error: sessionError 
    } = await supabase.auth.getSession();

    if (sessionError) {
        console.log(sessionError.message);
        return null;
    }

    const { data, error } = await supabase
        .from("playlists")
        .select("*")
        .eq("id", playlistId)
        .eq("user_id", sessionData.session?.user.id)
        .single();

    if (error || !data ) {
        console.log(error)
        return null;
    }
    
    console.log("Playlist ID received:", playlistId);

    
    const {data: imageResult }= supabase
        .storage
        .from("images")
        .getPublicUrl(data.image_path);
    
    return {
        ...data,
        image_url: imageResult?.publicUrl ?? null,
    };
    
    
};

export default getPlaylistById;