"use client"

import { useRouter } from "next/navigation";
import { useSessionContext } from "@supabase/auth-helpers-react";
import useAuthModal from "@/hooks/useAuthModal";
import { useUser } from "@/hooks/useUser";
import { useEffect, useState } from "react";
import { IoMdRemoveCircleOutline } from "react-icons/io";
import toast from "react-hot-toast";


interface RemoveButtonProps {
    songId: number;
    playlistId: string;
    onSongRemoved?: () => void;
}

const RemoveButton: React.FC<RemoveButtonProps> = ({
    songId,
    playlistId
}) => {
    const router = useRouter();
    const { supabaseClient } = useSessionContext();

    const authModal = useAuthModal();
    const { user } = useUser();

    const [isInThePlaylist, setIsInPlaylist] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect (() => {

        if (!user?.id || !playlistId || !songId) {
            return;
        }

        const checkPlaylist = async () => {
            const { data, error } = await supabaseClient
                .from('playlist_songs')
                .select('*')
                .eq('playlist_id', playlistId)
                .eq('song_id', songId)
                .eq('user_id', user.id);

            if (data && !error) {
                setIsInPlaylist(true);
            } else {
                setIsInPlaylist(false);
            }
        };

        checkPlaylist();
    }, [playlistId, songId, supabaseClient, user?.id]);

    const handleRemove = async () => {
        
        if (!user) {
            return authModal.onOpen();
        }

        setLoading(true);

        const { error } = await supabaseClient
            .from('playlist_songs')
            .delete()
            .eq('playlist_id', playlistId)
            .eq('song_id', songId)
            .eq("user_id", user.id);

        setLoading(false);

        if (error) {
            console.error("Supabase error:", error);
            toast.error("Failed to remove song"); 
        } else {
            toast.success("Song removed from playlist");
            setIsInPlaylist(false);
            router.refresh();
        }
    };

    if (!isInThePlaylist) {
        return null;
    }

    return (
        <button
            onClick={handleRemove}
            disabled={loading}
            className="
                group
                transition
            "
            title="Remove from playlist"
        >
            <IoMdRemoveCircleOutline 
                className={`
                    transition-colors duration-200
                    group-hover:text-red-500
                    ${loading ? "opacity-50 cursor-not-allowed" : ""}
                `}
                style={{ color: "#FF0000" }}
                size={25} 
            />
        </button>
    )
}

export default RemoveButton;