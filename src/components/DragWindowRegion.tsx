import { closeWindow, maximizeWindow, minimizeWindow } from "@/helpers/window_helpers";
import React, { type ReactNode } from "react";

interface DragWindowRegionProps {
    title?: ReactNode;
}

export default function DragWindowRegion({ title }: DragWindowRegionProps) {
    return (
        <div id="drag-window-region" className="flex w-screen flex-row-reverse items-stretch">
            <div className="flex">
                <button
                    title="Minimize"
                    type="button"
                    className="p-2 hover:bg-gray-700 rounded-lg"
                    onClick={minimizeWindow}
                >
                    <svg aria-hidden="true" role="img" width="15" height="15" viewBox="0 0 12 12">
                        <rect fill="currentColor" width="10" height="1" x="1" y="6" rx="10" ry="10"></rect>
                    </svg>
                </button>
                <button
                    title="Maximize"
                    type="button"
                    className="p-2 hover:bg-slate-700 rounded-lg"
                    onClick={maximizeWindow}
                >
                    <svg aria-hidden="true" role="img" width="15" height="15" viewBox="0 0 12 12">
                        <rect
                            width="9"
                            height="9"
                            x="1.5"
                            y="1.5"
                            fill="none"
                            rx="2"
                            ry="2"
                            stroke="currentColor"
                        ></rect>
                    </svg>
                </button>
                <button
                    type="button"
                    title="Close"
                    className="p-2 hover:bg-red-500 rounded-lg"
                    onClick={closeWindow}
                >
                    <svg aria-hidden="true" role="img" width="15" height="15" viewBox="0 0 12 12">
                        <polygon
                            fill="currentColor"
                            fillRule="evenodd"
                            points="11 1.576 6.583 6 11 10.424 10.424 11 6 6.583 1.576 11 1 10.424 5.417 6 1 1.576 1.576 1 6 5.417 10.424 1"
                        ></polygon>
                    </svg>
                </button>
            </div>
            <div className="draglayer w-full" />
            {title && <div className="flex flex-1 items-center justify-center p-2">{title}</div>}
        </div>
    );
}
