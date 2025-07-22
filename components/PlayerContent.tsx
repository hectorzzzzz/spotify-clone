"use client";

import { Song } from "@/types";
import MediaItem from "./MediaItem";
import LikeButton from "./LikeButton";
import { BsPauseFill, BsPlayFill } from "react-icons/bs";
import { AiFillStepBackward, AiFillStepForward } from "react-icons/ai";
import { HiSpeakerWave, HiSpeakerXMark } from "react-icons/hi2";
import Slider from "./Slider";
import SliderSlider from "./SliderProps";
import usePlayer from "@/hooks/usePlayer";
import { useEffect, useState } from "react";
import useSound from "use-sound";
import { BiShuffle } from "react-icons/bi";
import { LuRepeat, LuRepeat1 } from "react-icons/lu"
import { cn } from "@/lib/utils";

interface PlayerContentProps {
    song: Song;
    songUrl: string;
}

const PlayerContent: React.FC<PlayerContentProps> = ({
    song,
    songUrl
}) => {
    const player = usePlayer();
    const [volume, setVolume] = useState(1);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const Icon = isPlaying ? BsPauseFill : BsPlayFill;
    const VolumeIcon = volume === 0 ? HiSpeakerXMark : HiSpeakerWave
    const isShuffle = player.isShuffle;
    const toggleShuffle = player.toggleShuffle;
    const repeatMode = player.repeatMode;
    const cycleRepeatMode = player.cycleRepeatMode;

    const onPlayNext = () => {
        if (player.ids.length === 0) {
            return;
        }

        const currentIndex = player.ids.findIndex((id) => id === player.activeId);
        
        if (player.isShuffle) {
            let nextIndex = currentIndex;
            while (nextIndex === currentIndex && player.ids.length > 1) {
                nextIndex = Math.floor(Math.random() * player.ids.length);
            }
            const nextId = player.ids[nextIndex];
            player.setId(nextId);
        } else {
            const nextSong = player.ids[currentIndex + 1];
            if (!nextSong) {
                if(player.repeatMode === "repeat_all") {
                    return player.setId(player.ids[0]);
                }
                return;
            }
    
            player.setId(nextSong);
        }
    };

    const onPlayPrevious = () => {
        if (player.ids.length === 0) {
            return;
        }

        const currentIndex = player.ids.findIndex((id) => id === player.activeId);
        const previousSong = player.ids[currentIndex - 1];

        if (!previousSong) {
            return player.setId(player.ids[player.ids.length - 1]);
        }

        player.setId(previousSong);
    }

    const [play, { pause, sound }] = useSound(
        songUrl,
        {
            volume: volume,
            onplay: () => setIsPlaying(true),
            onend: () => {
                setIsPlaying(false);
                if (player.repeatMode === "repeat_one") {
                    sound?.seek(0);
                    sound?.play();
                } else {
                    onPlayNext();
                }
            },
            onpause: () => setIsPlaying(false),
            format: ['mp3']
        }
    );

    useEffect(() => {
        sound?.play();

        return () => {
            sound?.unload();
        }
    }, [sound]);

    useEffect (() => {
        if (sound) {
            setDuration(sound.duration() || 0);
        }
    }, [sound]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (sound && isPlaying) {
                setCurrentTime(sound.seek([]));
            }
        }, 1000)

        return () => clearInterval(interval);
    }, [sound, isPlaying]);

    const handlePlay = () => {
        if (!isPlaying) {
            play();
        } else {
            pause();
        }
    };

    const toggleMute = () => {
        if (volume === 0) {
            setVolume(1);
        } else {
            setVolume(0);
        }
    }

    const handleSeek = (value: number) => {
        if (sound) {
            sound.seek(value);
            setCurrentTime(value);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }

    return (
        <div className="w-full px-2 py-0.25 overflow-x-auto">
            <div
                className="
                    grid
                    grid-cols-2
                    md:grid-cols-3
                    h-full
                    
                "
            >
                <div
                    className="
                        flex
                        w-full
                        justify-start
                    "
                >
                    <div className="flex items-center gap-x-4 mb-2">
                        <MediaItem data={song} />
                        <LikeButton songId={song.id} />
                    </div>
                </div>

                <div
                    className="
                        flex
                        md:hidden
                        col-auto
                        w-full
                        justify-end
                        items-center
                    "
                >
                    <div
                        onClick={handlePlay}
                        className="
                            h-10
                            w-10
                            flex
                            items-center
                            justify-center
                            rounded-full
                            bg-white
                            p-1
                            cursor-pointer
                        "
                    >
                        <Icon size={25} className="text-black"/>
                    </div>
                </div>

                <div
                    className="
                        hidden
                        h-full
                        md:flex
                        flex-col
                        justify-center
                        items-center
                        w-full
                        px-2
                        gap-y-2
                    "
                >
                    <div
                        className="
                            flex
                            flex-wrap
                            items-center
                            justify-center
                            gap-x-4
                            w-full
                            min-w-0
                        "
                    >
                        <BiShuffle 
                            onClick={toggleShuffle}
                            size={25}
                            className={cn("cursor-pointer", isShuffle ? "text-white" : "text-neutral-400")}
                        />
                        <AiFillStepBackward
                            onClick={onPlayPrevious}
                            size={25} 
                            className="
                                text-neutral-400
                                cursor-pointer
                                hover:text-white
                                transition
                            "
                        />

                        <div 
                            onClick={handlePlay}
                            className="
                                flex
                                items-center
                                justify-center
                                h-10
                                w-10
                                rounded-full
                                bg-white
                                p-1
                                cursor-pointer
                            "
                        >
                            <Icon size={25} className="text-black"/>
                        </div>

                        <AiFillStepForward 
                            onClick={onPlayNext}
                            size={25}
                            className="
                                text-neutral-400
                                cursor-pointer
                                hover:text-white
                                transition
                            "
                        />

                        {repeatMode === "repeat_one" ? (
                            <LuRepeat1 
                                onClick={cycleRepeatMode}
                                size={25}
                                className="cursor-pointer text-white"
                            />
                        ) : (
                            <LuRepeat
                                onClick={cycleRepeatMode}
                                size={25}
                                className={cn(
                                    "cursor=pointer",
                                    repeatMode === "off" ? "text-neutral-400" : "text-white"
                                )}
                            />
                        )}
                    </div>

                        
                    <div className="
                            flex
                            items-center
                            gap-x-2
                            w-full
                        "
                    >
                        <div className="
                            w-[40px]
                            text-right
                            text-xs
                            text-neutral-400
                            
                        ">
                            <span>{formatTime(currentTime)}</span>
                        </div>
                        <div className="flex-1 px-1 min-w-[100px]">
                            <SliderSlider
                                value={currentTime}
                                max={duration}
                                step={1}
                                onChange={handleSeek}
                            />
                        </div>

                        <div className="
                            text-left
                            w-[40px]
                            text-xs
                            text-neutral-400
                            
                        ">
                            <span>{formatTime(duration)}</span>
                        </div>
                    </div>
                </div>

                <div
                    className="
                        hidden md:flex w-full justify-end pr-2
                    "
                >
                    <div className="flex items-center gap-x-2 min-w-[100px] max-w-[150px] w-full">
                        <VolumeIcon 
                            onClick={toggleMute}
                            className="cursor-pointer text-white"
                            size={25}
                        />
                        <Slider 
                            value={volume}
                            onChange={(value) => setVolume(value)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PlayerContent;