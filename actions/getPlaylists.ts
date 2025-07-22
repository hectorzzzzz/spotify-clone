//Fetch all playlists from user

//import anything you need
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Playlist } from "@/types";

//
const getPlaylist = async (): Promise<Playlist[]> => {
    const supabase = createServerComponentClient({
        cookies: cookies
    });

    const {
        data: {
            session
        }
    } = await supabase.auth.getSession();

    const { data, error } = await supabase
        .from('playlists')
        .select('*')
        .eq('user_id', session?.user?.id)
        .order('created_at', { ascending: false});

        if (error || !data) {
            console.log(error);
            return []
        }

    return data as Playlist []
};

export default getPlaylist;