import React from "react";
import ToggleTheme from "@/components/ToggleTheme";

export default function HomePage() {
    return (
        <>
            <div className="left-20 top-20 flex absolute">
                <ToggleTheme></ToggleTheme>
            </div>
            <div className="flex h-screen flex-col items-center justify-center gap-2">
                <h1 className="text-4xl">{("StudySmart")}</h1>
            </div>
        </>
    );
}
