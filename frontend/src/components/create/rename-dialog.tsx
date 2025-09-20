"use client";

import { useState } from "react";
import type { Track } from "./track-list";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export default function RenameDialog({ track, onClose, onRename }: { track: Track; onClose: () => void; onRename: (trackId: string, newName: string) => void; }) {
    const [title, setTitle] = useState(track.title ?? "");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (title.trim()) {
            onRename(track.id, title.trim());;
        }
        onClose();
    };

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Rename Song</DialogTitle>
                        <DialogDescription>Enter a new name for your song, click save when you&apos;re done.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right" >
                                Title
                            </Label>
                            <Input id="name" value={title} onChange={(e) => setTitle(e.target.value)} className="col-span-3" />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit">Save Changes</Button>
                        <DialogClose asChild>
                            <Button variant="outline" type="button">
                                Close
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}