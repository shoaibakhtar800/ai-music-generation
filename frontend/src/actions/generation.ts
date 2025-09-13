"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { inngest } from "~/inngest/client";
import { auth } from "~/lib/auth";
import { db } from "~/server/db";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { env } from "~/env";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export interface GenerateSongProps {
    prompt?: string;
    lyrics?: string;
    fullDescribedSong?: string;
    describedLyrics?: string;
    instrumental?: boolean;
}

export async function generateSong(generateSong: GenerateSongProps) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/auth/sign-in");
    }

    await queueSong(generateSong, 7.5, session.user.id);
    await queueSong(generateSong, 15, session.user.id);

    revalidatePath("/create");
}

export async function queueSong(generateSong: GenerateSongProps, guidanceScale: number, userId: string) {
    let title = "Untitled";
    if (generateSong.describedLyrics) title = generateSong.describedLyrics;
    if (generateSong.fullDescribedSong) title = generateSong.fullDescribedSong;

    title = title.charAt(0).toUpperCase() + title.slice(1);

    const song = await db.song.create({
        data: {
            userId: userId,
            title: title,
            prompt: generateSong.prompt,
            lyrics: generateSong.lyrics,
            describedLyrices: generateSong.describedLyrics,
            fullDescribedSong: generateSong.fullDescribedSong,
            instrumental: generateSong.instrumental,
            guidanceScale: guidanceScale,
            audioDuration: 180
        },
    });

    await inngest.send({
        name: "generate-song-event",
        data: {
            songId: song.id,
            userId: song.userId,
        },
    });
}

export async function getPlayUrl(songId: string) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/auth/sign-in");
    }

    const song = await db.song.findUniqueOrThrow({
        where: {
            id: songId,
            OR: [{ userId: session.user.id }, { published: true }],
            s3Key: { not: null },
        },
        select: {
            s3Key: true,
        },
    });

    await db.song.update({
        where: { id: songId },
        data: { listenCount: { increment: 1 } },
    });

    return await getPresignedUrl(song.s3Key!);
}

export async function getPresignedUrl(s3Key: string) {
    const s3Client = new S3Client({
        region: env.AWS_REGION,
        credentials: {
            accessKeyId: env.AWS_ACCESS_KEY_ID,
            secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
        },
    });

    const command = new GetObjectCommand({
        Bucket: env.S3_BUCKET_NAME,
        Key: s3Key,
    });

    return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
}