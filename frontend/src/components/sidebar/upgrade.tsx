"use client";

import { authClient } from "~/lib/auth-client";
import { Button } from "../ui/button";

export default function Upgrade() {
    const upgrade = async () => {
        await authClient.checkout({
            products: [
                "a5b834f5-b586-4c77-a3ea-ca5b87cac1e9",
                "20e6fbda-4fec-4336-996e-50abbe2821f0",
                "65ba7330-719e-4a8c-b396-87f3dc04cf1a"
            ],
        });
    }

    return (
        <Button
            variant="outline"
            size="sm"
            className="ml-2 cursor-pointer text-orange-400"
            onClick={upgrade}
        >
            Upgrade
        </Button>
    );
}