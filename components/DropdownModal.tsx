"use client"

import { useDropdownModal } from "@/hooks/useDropDownModal";
import { useEffect, useRef } from "react";
import { disableScroll, enableScroll } from "@/lib/disableScroll";

const DropDownModal= () => {
    const { 
        isOpen, 
        song, 
        playlists, 
        onAddToPlaylist, 
        onClose,
        position
    } = useDropdownModal();
    const dropDownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
          if (
            dropDownRef.current &&
            !dropDownRef.current.contains(event.target as Node)
          ) {
            onClose();
          }
        };
    
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            disableScroll();
        } else {
            enableScroll();
        }
    
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            enableScroll();
        };
    }, [isOpen, onClose]);

    if (!isOpen || !song || !position) return null;

    return (
        <div
            ref={dropDownRef}
            className="
                fixed
                top-[50%]
                left-[50%]
                -translate-x-1/2
                -translate-y-1/2
                z-50
                bg-neutral-800
                rounded-md
                p-4
                text-sm
                text-white
                shadow-lg
                w-[200px]
                max-w-md
                max-h-[80vh]
                overflow-y-auto
            "
            style={{
                top: position.top + 100,
                left: position.left + 110,
            }}
        >
            <h3
                className="
                    text-neutral-400
                    px-2
                "
            >
                Add to Playlist
            </h3>
            
            {playlists.length === 0 ? (
                <div>
                    <p>No Playlist</p>
                </div>
            ) : (
                <ul className="space-y-2 mt-4 truncate">
                    {playlists.map((playlist) => (
                        <li
                            key={playlist.id}
                            onClick={() => {
                                onAddToPlaylist(playlist.id, song.id);
                                onClose();
                            }}
                            className="cursor-pointer px-4 py-2 rounded hover:bg-neutral-100 transition text-sm font-medium"
                        >
                            {playlist.name}
                        </li>
                    ))}
                </ul>
            )}
            
        </div>
    )
}

export default DropDownModal;
