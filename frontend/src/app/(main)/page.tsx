import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { toast } from "sonner";
import CreateSong from "~/components/create";
import { auth } from "~/lib/auth"

export default async function HomePage() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        toast("Unauthorized.")
        redirect("/auth/sign-in");
    }

    return (
        <main className="container flex grow flex-col items-center justify-center self-center p-4 md:p-6">
            <h1 className="text-2xl font-bold">Welcome to the Music Generator!</h1>
            <p className="mt-4 text-center text-lg">
                Use AI to create your own music tracks effortlessly.
            </p>
            <CreateSong />
        </main>
    );
}