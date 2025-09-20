"use client";

import { Download, MoreHorizontal, Music, Pause, Play, Volume2 } from "lucide-react";
import Image from "next/image";
import { usePlayerStore } from "~/stores/use-player-store";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { useEffect, useRef, useState } from "react";
import { Slider } from "./ui/slider";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { toast } from "sonner";

export default function SoundBar() {
    const { track } = usePlayerStore();
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState([100]);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        if (audioRef.current && track?.url) {
            setCurrentTime(0);
            setDuration(0);

            audioRef.current.src = track.url;
            audioRef.current?.load();

            const playPromise = audioRef.current.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    setIsPlaying(true);
                }).catch((error) => {
                    toast.error("Playback failed, please try again");
                    console.error("Playback failed: ", error);
                    setIsPlaying(false);
                });
            }
        }
    }, [track]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const updateTime = () => setCurrentTime(audio.currentTime);

        const updateDuration = () => {
            if (!isNaN(audio.duration)) {
                setDuration(audio.duration);
            }
        };

        const handleTrackEnd = () => {
            setIsPlaying(false);
            setCurrentTime(0);
        };

        audio.addEventListener("timeupdate", updateTime);
        audio.addEventListener("loadedmetadata", updateDuration);
        audio.addEventListener("ended", handleTrackEnd);

        return () => {
            audio.removeEventListener("timeupdate", updateTime);
            audio.removeEventListener("loadedmetadata", updateDuration);
            audio.removeEventListener("ended", handleTrackEnd);
        };
    }, [track]);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume[0]! / 100;
        }
    }, [volume]);

    const togglePlay = async () => {
        if (!track?.url || !audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        }
        else {
            await audioRef.current.play();
            setIsPlaying(true);
        }
    };

    const handleSeek = (value: number[]) => {
        if (audioRef.current && value[0] !== undefined) {
            audioRef.current.currentTime = value[0];
            setCurrentTime(value[0]);
        }
    };

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);

        return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
    };

    if (!track) return null;

    return (
        <div className="px-4 pb-2">
            <Card className="bg-background/60 relative w-full shrink-0 border-t py-0 backdrop-blur">
                <div className="space-y-2 p-3">
                    <div className="flex items-center justify-between">
                        <div className="flex min-w-0 flex-1 items-center gap-2">
                            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-purple-500 to-pink-500 relative">
                                {track?.artwork ? (<Image fill className="rounded-md object-cover" src={track.artwork} alt="song cover" />) : (<Music className="text-white h-4 w-4" />)}
                            </div>

                            <div className="max-w-24 min-w-0 flex-1 md:max-w-full">
                                <p className="truncate text-sm font-medium">
                                    {track?.title}
                                </p>
                                <p className="text-muted-foreground truncate text-xs">{track?.createdByUserName}</p>
                            </div>
                        </div>

                        <div className="absolute left-1/2 -translate-x-1/2">
                            <Button variant="ghost" size="icon" onClick={togglePlay}>
                                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                            </Button>
                        </div>

                        <div className="flex items-center gap-1">
                            <div className="flex items-center gap-2">
                                <Volume2 className="h-4 w-4" />
                                <Slider value={volume} onValueChange={setVolume} step={1} className="w-16" max={100} min={0} />
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                        <MoreHorizontal className="w-4 h-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-40">
                                    <DropdownMenuItem onClick={() => {
                                        if (!track?.url) return;
                                        window.open(track?.url, "_blank")
                                    }}>
                                        <Download className="mr-2 h-4 w-4" />
                                        Download
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>

                    <div className="flex items-center gap-1">
                        <span className="text-muted-foreground w-8 text-right text-[10px]">
                            {formatTime(currentTime)}
                        </span>
                        <Slider className="flex-1" value={[currentTime]} max={duration || 100} step={1} onValueChange={handleSeek} />
                        <span className="text-muted-foreground w-8 text-right text-[10px]">
                            {formatTime(duration)}
                        </span>
                    </div>
                </div>

                {track?.url && <audio ref={audioRef} src={track.url} preload="metadata" />}
            </Card>
        </div>
    );
}