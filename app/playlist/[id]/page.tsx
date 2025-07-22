import getPlaylistSongs from "@/actions/getPlaylistSongs";

export const revalidate = 0;
import Image from "next/image";
import Header from "@/components/Header";
import PlaylistContent from "../components/playlistContent";
import getPlaylistById from "@/actions/getPlaylistById";

interface PlaylistPageProps {
    params: {
        id: string;
    }
}

const PlaylistPage = async ({ params }: PlaylistPageProps) => {
    const playlist = await getPlaylistById(params.id)
    
    const songs = await getPlaylistSongs(params.id)

    if (!playlist) {
        return (
          <div className="text-white p-6">
            Playlist tidak ditemukan.
          </div>
        );
    }

    console.log("Playlist ID param:", params.id);

    return (
        <div
            className="
                bg-neutral-900
                rounded-lg
                h-full
                w-full
                overflow-hidden
                overflow-y-auto    
            "
        >
            <Header>
                <div className="mt-20">
                    <div
                        className="
                            flex
                            flex-col
                            md:flex-row
                            items-center
                            gap-x-5
                        "
                    >
                        <div 
                            className="
                                relative
                                h-32
                                w-32
                                lg:h-44
                                lg:w-44
                            "
                        >
                            <Image
                                fill
                                alt="Playlist"
                                className="object-cover"
                                src= {playlist.image_url ?? "/images/placeholder.png"}
                            />
                        </div>
                        <div className="
                            flex
                            flex-col
                            gap-y-2
                            mt-4
                            md:mt-0
                        ">
                            <p className="hidden md:block font-semibold text-sm text-white">
                                Playlist
                            </p>
                            <h1 className="
                                text-white
                                text-4xl
                                sm:text-5xl
                                lg:text-7xl
                                font-bold
                            ">
                                {playlist.name}
                            </h1>
                            {playlist.desc && (
                                <p className="text-neutral-400 text-sm whitespace-pre-wrap">
                                    {playlist.desc}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </Header>
            <PlaylistContent songs={songs} playlistId={playlist.id} />
        </div>
    );
    
}



export default PlaylistPage;