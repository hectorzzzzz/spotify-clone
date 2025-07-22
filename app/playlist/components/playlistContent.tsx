"use client";

import { useRouter } from "next/navigation";
import { Song } from "@/types";
import { useUser } from "@/hooks/useUser";
import { useEffect, useState } from "react";
import MediaItem from "@/components/MediaItem";
import LikeButton from "@/components/LikeButton";
import useOnPlay from "@/hooks/useOnPlay";
import RemoveButton from "@/components/RemoveButton";

interface PlaylistContentProps {
    songs: Song[];
    playlistId: string;
    onSongRemoved?: (songId: number) => void;
}

const PlaylistContent: React.FC<PlaylistContentProps> = ({
    songs,
    playlistId,
    onSongRemoved
}) => {
    const router = useRouter();
    const { isLoading, user } = useUser();
    const onPlay = useOnPlay(songs);

    useEffect(() => {
        if (!isLoading && !user) {
            router.replace('/');
        }
    }, [isLoading, user, router]);

    if (songs.length === 0) {
        return (
            <div className="
                flex
                flex-col
                gap-y-2
                w-full
                px-6
                text-neutral-400
            ">
                No songs added.
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-y-2 w-full p-6">
            {songs.map((song, index) => (
                <div
                    key={`${song.id}-${index}`}
                    className="flex items-center gap-x-4 w-full"
                >
                    <div className="flex-1">
                        <MediaItem 
                            onClick={(id: string) => onPlay(id)}
                            data={song}
                        />
                    </div>
                    <RemoveButton 
                        songId={Number(song.id)} 
                        playlistId={playlistId}
                        onSongRemoved={() => onSongRemoved?.(Number(song.id))}
                    />
                </div>
            ))}
        </div>
    );
}

export default PlaylistContent;