"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Loader2, Music, Plus } from "lucide-react";
import { Switch } from "../ui/switch";
import { Badge } from "../ui/badge";
import { toast } from "sonner";
import { generateSong, type GenerateSongProps } from "~/actions/generation";

const inspirationTags = [
    "80s synth-pop",
    "Acoustic ballad",
    "Epic movie score",
    "Lo-fi hip hop",
    "Driving rock anthem",
    "Summer beach vibe",
];

const styleTags = [
    "Industrial rave",
    "Heavy bass",
    "Orchestral",
    "Electronic beats",
    "Funky guitar",
    "Soulful vocals",
    "Ambient pads",
];

export default function SongPanel() {
    const [mode, setMode] = useState<"simple" | "custom">("simple");
    const [description, setDescription] = useState("");
    const [instrumental, setInstrumental] = useState(false);
    const [lyricsMode, setLyricsMode] = useState<"write" | "auto">("write");
    const [lyrics, setLyrics] = useState("");
    const [styleInput, setStyleInput] = useState("");
    const [loading, setLoading] = useState(false);

    const handleStyleInputTagClick = (tag: string) => {
        const currentTags = styleInput
            .split(",")
            .map((s) => s.trim())
            .filter((s) => s);

        if (!currentTags.includes(tag)) {
            if (styleInput.trim() === "") {
                setStyleInput(tag);
            }
            else {
                setStyleInput(styleInput + ", " + tag);
            }
        }
    }

    const handleCreate = async () => {
        if (mode === "simple" && !description.trim()) {
            toast.error("Please provide a description for your song.");
            return;
        }

        if (mode === "custom" && !styleInput.trim()) {
            toast.error("Please provide styles or instructions for your song.");
            return;
        }

        let requestBody: GenerateSongProps;

        if (mode === "simple") {
            requestBody = {
                fullDescribedSong: description,
                instrumental,
            };
        } else {
            const prompt = styleInput;
            if (lyricsMode === "write") {
                requestBody = {
                    prompt,
                    lyrics,
                    instrumental,
                };
            } else {
               requestBody = {
                    prompt,
                    describedLyrics: lyrics,
                    instrumental,
                }; 
            }
        }

        try {
            setLoading(false);
            await generateSong(requestBody);
            setDescription("");
            setLyrics("");
            setStyleInput("");
            setMode("simple");
            setLyricsMode("auto");
            setInstrumental(false);
            toast.success("Your song is being created! This may take a few minutes.");
        } catch (error) {
            toast.error("An error occurred while creating your song. Please try again.");
            console.error("Error generating song:", error);
        }
        finally {
            setLoading(false);
        }
    }

    const handleInspirationTagClick = (tag: string) => {
        const currentTags = description
            .split(",")
            .map((s) => s.trim())
            .filter((s) => s);

        if (!currentTags.includes(tag)) {
            if (description.trim() === "") {
                setDescription(tag);
            }
            else {
                setDescription(description + ", " + tag);
            }
        }
    }

    return (
        <div className="bg-muted/30 flex w-full flex-col border-r lg:w-80">
            <div className="flex-1 overflow-y-auto p-4">
                <Tabs value={mode} onValueChange={(value) => setMode(value as "simple" | "custom")}>
                    <TabsList className="w-full">
                        <TabsTrigger value="simple">
                            Simple
                        </TabsTrigger>
                        <TabsTrigger value="custom">
                            Custom
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="simple" className="mt-6 space-y-6">
                        <div className="flex flex-col gap-3">
                            <label className="text-sm font-medium">
                                Describe your song
                            </label>
                            <Textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="min-h-[120px] resize-none"
                                placeholder="A dreamy lofi hip hop song, perfect for studying or relaxing"
                            />
                        </div>

                        {/* Placeholder for additional controls */}
                        <div className="flex items-center justify-between">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setMode("custom")}
                            >
                                <Plus className="mr-2" />
                                Lyrics
                            </Button>
                            <div className="flex items-center gap-2">
                                <label className="text-sm font-medium">Instrumental</label>
                                <Switch
                                    checked={instrumental}
                                    onCheckedChange={setInstrumental}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <label className="text-sm font-medium">Inspiration</label>
                            <div className="w-full overflow-x-auto whitespace-nowrap">
                                <div className="flex gap-2 pb-2">
                                    {inspirationTags.map((tag) => (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-7 flex-shring-0 bg-transparent text-xs"
                                            key={tag}
                                            onClick={() => handleInspirationTagClick(tag)}
                                        >
                                            <Plus className="mr-1" />
                                            {tag}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="custom" className="mt-6 space-y-6">
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium">Lyrics</label>
                                <div className="flex items-center gap-1">
                                    <Button
                                        onClick={() => {
                                            setLyricsMode("auto");
                                            setLyrics("");
                                        }}
                                        variant={lyricsMode === "auto" ? "secondary" : "ghost"}
                                        className="h-7 text-xs"
                                        size="sm"
                                    >
                                        Auto
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            setLyricsMode("write");
                                            setLyrics("");
                                        }}
                                        variant={lyricsMode === "write" ? "secondary" : "ghost"}
                                        className="h-7 text-xs"
                                        size="sm"
                                    >
                                        Write
                                    </Button>
                                </div>
                            </div>
                            <Textarea
                                value={lyrics}
                                onChange={(e) => setLyrics(e.target.value)}
                                className="min-h-[100px] resize-none"
                                placeholder={lyricsMode === "write" ? "Write your lyrics here..." : "Describe the theme or mood for auto-generated lyrics..."}
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium">Instrumental</label>
                            <Switch
                                checked={instrumental}
                                onCheckedChange={setInstrumental}
                            />
                        </div>

                        {/* Placeholder for additional controls */}
                        <div className="flex flex-col gap-3">
                            <label className="text-sm font-medium">Styles</label>
                            <Textarea
                                value={styleInput}
                                onChange={(e) => setStyleInput(e.target.value)}
                                className="min-h-[60px] resize-none"
                                placeholder="Enter custom styles or instructions..."
                            />
                            <div className="w-full overflow-x-auto whitespace-nowrap">
                                <div className="flex gap-2 pb-2">
                                    {
                                        styleTags.map((styleTag) => (
                                            <Badge
                                                onClick={() => handleStyleInputTagClick(styleTag)}
                                                variant="secondary" key={styleTag} className="hover:bg-secondary/50 flex-shrink-0 cursor-pointer text-xs">
                                                {styleTag}
                                            </Badge>
                                        ))
                                    }
                                </div>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>

            <div className="border-t p-4">
                <Button
                    onClick={handleCreate}
                    disabled={loading}
                    className="w-full cursor-pointer bg-gradient-to-r from-orange-500 to-pink-500 font-medium text-white hover:from-orange-600 hover:to-pink-600"
                >
                    {loading ? <Loader2 className="animate-spin" /> : <Music />}
                    {loading ? "Creating..." : "Create"}
                </Button>
            </div>
        </div>
    );
}