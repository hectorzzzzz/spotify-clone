"use client"

import { FaPlay } from "react-icons/fa";
import Image from "next/image";
import { useRouter } from "next/navigation";
import useLoadImagePlaylist from "@/hooks/useLoadImagePlaylist";
import { Playlist } from "@/types";

interface NewPlaylistItemProps {
    playlist: Playlist;
    href: string;
}

const NewPlaylist: React.FC<NewPlaylistItemProps> = ({
    playlist,
    href
}) => {
    const router = useRouter()
    //
    const onClick = () => {
        router.push(href);
    }
    const imageUrl = useLoadImagePlaylist(playlist)
    return (
            <button
                onClick={onClick}
                className="
                    relative
                    group
                    flex
                    items-center
                    rounded-md
                    overflow-hidden
                    gap-x-4
                    bg-neutral-100/10
                    hover:bg-neutral-100/20
                    transition
                    pr-4
                "
            >
                <div className="
                    relative 
                    min-h-[64px] 
                    min-w-[64px]
                ">
                    <Image 
                        className="object-cover"
                        fill
                        src={imageUrl ?? "/images/placeholder.png"}
                        alt="Image"
                    />
                </div>
                <p className="text-white font-medium truncate py-5">
                    {playlist.name}
                </p>
                <div 
                    className="
                        absolute
                        transition
                        opacity-0
                        rounded-full
                        flex
                        items-center
                        justify-center
                        bg-green-500
                        p-4
                        drop-shadow-md
                        right-5
                        group-hover:opacity-100
                        hover:scale-110
                    "
                >
                    <FaPlay className="text-black"/>
                </div>
            </button>
        )
}

export default NewPlaylist;