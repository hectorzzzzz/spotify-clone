"use client";

import { Song } from "@/types";
import useLoadImage from "@/hooks/useLoadImage";
import Image from "next/image";
import PlayButton from "@/components/PlayButton";
import { Playlist } from "@/types";
import { useDropdownModal } from "@/hooks/useDropDownModal";
import MoreButton from "@/components/MoreButton";

interface SongItemProps {
    data: Song;
    playlists: Playlist[];
    onAddToPlaylist: (playlistId: string, songId: string) => void;
    onClick: (id: string) => void
};

const SongItem: React.FC<SongItemProps> = ({
    data,
    playlists,
    onAddToPlaylist,
    onClick
}) => {
    const dropDownModal = useDropdownModal();
    const imagePath = useLoadImage(data);

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        const rect = e.currentTarget.getBoundingClientRect();
        const popupWidth = 200; 
        const popupHeight = 150;
        let top = rect.bottom + window.scrollY;
        let left = rect.left + window.scrollX;
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        if (left + popupWidth > viewportWidth) {
            left = rect.right - popupWidth + window.scrollX;
        }

        if (top + popupHeight > window.scrollY + viewportHeight) {
            top = rect.top - popupHeight + window.scrollY;
        }

        const position = { top, left }
    
        dropDownModal.onOpen(data, playlists, position, onAddToPlaylist);
    };

    return (
        <div
            className="
                relative
                group
                flex
                flex-col
                items-center
                justify-center
                rounded-md
                overflow-hidden
                gap-x-4
                bg-neutral-400/5
                hover:bg-neutral-400/10
                transition
                p-3
            "
        >
            <div
                className="
                    relative
                    aspect-square
                    w-full
                    h-full
                    rounded-md
                    overflow-hidden
                "
            >
                <Image 
                    className="object-cover"
                    src={imagePath || '/images/liked.png'}
                    fill
                    alt="Image"
                />
            </div>
            
            <div className="flex flex-col items-start w-full pt-4 gap-y-1">
                <p className="text-white font-semibold truncate w-full">
                    {data.title}
                </p>
                <p className="text-neutral-400 text-sm pb-4 w-full truncate">
                    {data.author}
                </p>
            </div>

            <div
                className="
                    absolute
                    bottom-24
                    right-5
                "
            >
                <div onClick={() => onClick(data.id)}>
                    <PlayButton />
                </div>
            </div>

            <div
                className="
                    absolute
                    bottom-5
                    right-2
                    shrink-0
                "
            >
                <div
                    onClick={handleClick}
                >
                    <MoreButton />
                </div>
            </div>
        </div>
    );
}

export default SongItem;