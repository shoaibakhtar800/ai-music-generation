"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { toast } from "sonner";
import { getPResignedUrl } from "~/actions/generation";
import { auth } from "~/lib/auth";
import { db } from "~/server/db";

export default async function TrackListFetcher() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        toast.error("Unauthorized.")
        redirect("/auth/sign-in");
    }

    const songs = await db.song.findMany({
        where: { userId: session.user.id },
        include: {
            user: {
                select: {
                    name: true,
                },
            },
        },
        orderBy: { 
            createdAt: "desc"
        },
    });

    const songsWithThumbnail = await Promise.all(
        songs.map(async (song) => {
            const thumbnailUrl = song.thumbnailS3Key ? getPResignedUrl(song.thumbnailS3Key) : null; 

            return {
                id: song.id,
                title: song.title,
                createdAt: song.createdAt,
                instrumental: song.instrumental,
                prompt: song.prompt,
                lyrics: song.lyrics,
                fullDescribedSong: song.fullDescribedSong,
                describedLyrics: song.describedLyrices,
                thumbnailUrl,
                playUrl: null,
                status: song.status,
                createdByUserName: song.user.name || "Unknown",
                published: song.published,
            };
        }),
    );

    return (
        <p>Tracks loaded</p>
    )
}