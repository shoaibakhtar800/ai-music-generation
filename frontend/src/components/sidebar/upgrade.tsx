"use client";

import { Button } from "../ui/button";

export default function Upgrade() {
    return (
        <Button
            variant="outline"
            size="sm"
            className="ml-2 cursor-pointer text-orange-400"
            onClick={() => {
                window.open("https://buy.stripe.com/test_8wM5kU4cZ9DufyA6op", "_blank", "noreferrer");
            }}
        >
            Upgrade
        </Button>
    );
}