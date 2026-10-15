import React, { createContext, useContext, useEffect } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";

/**
 * Text labels for 3D scenes, rendered as plain DOM in the scene's own React tree
 * (drei's <Html> mounts one extra React root per label, which React 19 warns
 * about on unmount). Components inside the canvas publish label specs; Scene3D
 * renders the divs; LabelProjector moves them every frame.
 */
export interface Label3D {
    key: string;
    text: React.ReactNode;
    position: [number, number, number];
    variant?: "tick" | "title" | undefined;
}

interface LabelsContextValue {
    publish: (group: string, labels: Label3D[]) => void;
    elements: Map<string, HTMLDivElement>;
}

export const LabelsContext = createContext<LabelsContextValue | null>(null);

/** Publish a group of labels from inside the canvas; they are removed on unmount. */
export function useLabels(group: string, labels: Label3D[]) {
    const ctx = useContext(LabelsContext);
    useEffect(() => {
        ctx?.publish(group, labels);
        return () => ctx?.publish(group, []);
    }, [ctx, group, labels]);
}

const projected = new THREE.Vector3();

/** Projects every published label to screen space and positions its div. */
export const LabelProjector: React.FC<{ labels: Label3D[] }> = ({ labels }) => {
    const ctx = useContext(LabelsContext);
    const { camera, size } = useThree();

    useFrame(() => {
        if (!ctx) return;
        for (const label of labels) {
            const el = ctx.elements.get(label.key);
            if (!el) continue;
            projected.set(...label.position).project(camera);
            const visible = projected.z < 1;
            const x = (projected.x * 0.5 + 0.5) * size.width;
            const y = (-projected.y * 0.5 + 0.5) * size.height;
            el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) translate(-50%, -50%)`;
            el.style.visibility = visible ? "visible" : "hidden";
        }
    });

    return null;
};
