"use client"

import { BsPlusLg } from "react-icons/bs";
import useCreatePlaylistModal from "@/hooks/useCreatePlaylistModal";


interface PlaylistListItemProps {
    name: string;
}

const PlayListListItem: React.FC<PlaylistListItemProps> = ({
    name
}) => {
    const playlistModal = useCreatePlaylistModal();
    return (
        <button
            onClick={() => playlistModal.onOpen()}
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
                bg-neutral-100/10
                rounded-md
                p-3.5
            ">
                <BsPlusLg
                    className="text-white"
                    size={35}
                />
            </div>
            <p className="text-white font-medium truncate py-5">
                {name}
            </p>
        </button>
    )
}

export default PlayListListItem;