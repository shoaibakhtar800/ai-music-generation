"use client";

import { Download, Loader2, MoreHorizontal, Music, Pencil, Play, RefreshCcw, Search, XCircle } from "lucide-react";
import { Input } from "../ui/input";
import { useState } from "react";
import { Button } from "../ui/button";
import Image from "next/image";
import { getPlayUrl } from "~/actions/generation";
import { Badge } from "../ui/badge";
import { renameSong, setPublishedStatus } from "~/actions/song";
import { DropdownMenu, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { DropdownMenuContent } from "@radix-ui/react-dropdown-menu";
import RenameDialog from "./rename-dialog";

export interface Track {
    id: string;
    title: string | null;
    createdAt: Date;
    instrumental: boolean;
    prompt: string | null;
    lyrics: string | null;
    fullDescribedSong: string | null;
    describedLyrics: string | null;
    thumbnailUrl: string | null;
    playUrl: string | null;
    status: string | null;
    createdByUserName: string | null;
    published: boolean;
}

export default function TrackList({ tracks }: { tracks: Track[] }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [loadingTrackId, setLoadingTrackId] = useState<string | null>(null);
    const [trackToRename, setTrackToRename] = useState<Track | null>(null);

    const handleTrackSelect = async (track: Track) => {
        if (loadingTrackId) return;

        setLoadingTrackId(track.id);
        const playUrl = await getPlayUrl(track.id);
        setLoadingTrackId(null);

        console.log("Play URL:", playUrl);
    }

    const filteredTracks = tracks.filter((track) => track.title?.toLowerCase().includes(searchQuery.toLowerCase()) ??
        track.prompt?.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div className="flex flex-1 flex-col overflow-y-scroll">
            <div className="flex-1 p-6">
                <div className="mb-4 flex items-center justify-between gap-4">
                    <div className="relative max-w-md flex">
                        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                        <Input placeholder="Search..." className="pl-10" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                    </div>
                    <Button disabled={isRefreshing} variant="outline" size="sm" onClick={() => { }}>
                        {isRefreshing ? <Loader2 className="mr-2 animate-spin" /> : <RefreshCcw className="mr-2" />}
                        Refresh
                    </Button>
                </div>

                {/*}Track lis*/}
                <div className="space-y-2">
                    {filteredTracks.length > 0 ? (filteredTracks.map((filteredTrack) => {
                        switch (filteredTrack.status) {
                            case "failed":
                                return (
                                    <div key={filteredTrack.id} className="flex cursor-not-allowed items-center gap-4 rounded-lg p-3">
                                        <div className="bg-destructive/10 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-md">
                                            <XCircle className="text-destructive h-6 w-6" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h3 className="text-destructive truncate text-sm font-medium">Generation failed</h3>
                                            <p className="text-muted-foreground truncate text-xs">Please try creating the song again.</p>
                                        </div>
                                    </div>
                                );
                            case "no credits":
                                return (
                                    <div key={filteredTrack.id} className="flex cursor-not-allowed items-center gap-4 rounded-lg p-3">
                                        <div className="bg-destructive/10 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-md">
                                            <XCircle className="text-destructive h-6 w-6" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h3 className="text-destructive truncate text-sm font-medium">Not enough credits</h3>
                                            <p className="text-muted-foreground truncate text-xs">Please purchase more credits to generate this song.</p>
                                        </div>
                                    </div>
                                );
                            case "queued":
                            case "processing":
                                return (
                                    <div key={filteredTrack.id} className="flex cursor-not-allowed items-center gap-4 rounded-lg p-3">
                                        <div className="bg-muted flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-md">
                                            <Loader2 className="text-muted-foreground animate-spin h-6 w-6" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h3 className="text-muted-foreground truncate text-sm font-medium">Processing song...</h3>
                                            <p className="text-muted-foreground truncate text-xs">Refresh to check the status.</p>
                                        </div>
                                    </div>
                                );
                            default:
                                return (
                                    <div
                                        key={filteredTrack.id}
                                        className="hover:bg-muted/50 flex cursor-pointer items-center gap-4 rounded-lg p-3 transition-colors"
                                        onClick={() => handleTrackSelect(filteredTrack)}
                                    >
                                        {/*Thumbnail*/}
                                        <div className="group relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-md">
                                            {
                                                filteredTrack.thumbnailUrl ? (
                                                    <Image src={filteredTrack.thumbnailUrl} fill className="object-cover" alt="thumbnail" />
                                                ) : (
                                                    <div className="bg-muted flex h-full w-full items-center justify-center">
                                                        <Music className="text-muted-foreground h-6 w-6" />
                                                    </div>
                                                )
                                            }
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100">
                                                {loadingTrackId === filteredTrack.id ? (<Loader2 className="animate-spin text-white" />) : (<Play className="text-white" />)}
                                            </div>
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-2">
                                                <h3 className="truncate text-sm font-medium">
                                                    {filteredTrack.title}
                                                </h3>
                                                {filteredTrack.instrumental && <Badge variant="outline">Instrumental</Badge>}
                                            </div>
                                            <p className="text-muted-foreground truncate text-xs">
                                                {filteredTrack.prompt}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Button onClick={async (e) => {
                                                e.stopPropagation();
                                                await setPublishedStatus(filteredTrack.id, !filteredTrack.published)
                                            }}
                                                variant="outline"
                                                size="sm"
                                                className={`cursor-pointer ${filteredTrack.published ? "border-red-200" : ""}`}
                                            >
                                                {filteredTrack.published ? "Unpublish" : "Publish"}
                                            </Button>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreHorizontal />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-40">
                                                    <DropdownMenuItem
                                                        onClick={async (e) => {
                                                            e.stopPropagation();
                                                            const playUrl = await getPlayUrl(filteredTrack.id);
                                                            window.open(playUrl, "_blank");
                                                        }}
                                                    >
                                                        <Download className="mr-2" /> Download
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={async (e) => {
                                                            e.stopPropagation();
                                                            setTrackToRename(filteredTrack);
                                                        }}
                                                    >
                                                        <Pencil className="mr-2" /> Rename
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>
                                );
                        }
                    })) : (<div>Hello</div>)}
                </div>
            </div>

            {trackToRename && (
                <RenameDialog
                    track={trackToRename}
                    onClose={() => setTrackToRename(null)}
                    onRename={(trackId, newTitle) => renameSong(trackId, newTitle)}
                />
            )}
        </div>
    );
}