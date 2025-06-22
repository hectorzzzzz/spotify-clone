import useAuthModal from "./useAuthModal";
import usePlayer from "./usePlayer"
import { useUser } from "./useUser";
import { Song } from "@/types"
import useSubscribeModal from "@/hooks/useSubscribeModal"

const useOnPlay = (songs: Song[]) => {
    const player = usePlayer();
    const SubscribeModal = useSubscribeModal();
    const authModal = useAuthModal();
    const { user, subscription } = useUser();

    const onPlay = (id: string) => {
        if (!user) {
            return authModal.onOpen();
        }

        if (!subscription) {
            return SubscribeModal.onOpen();
        }

        player.setId(id);
        player.setIds(songs.map((song) => song.id));
    };

    return onPlay;
}

export default useOnPlay;