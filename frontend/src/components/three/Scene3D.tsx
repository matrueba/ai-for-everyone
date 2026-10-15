import React, { useCallback, useMemo, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import Icon from "../ui/Icon";
import { useT } from "../../i18n";
import { HEIGHT } from "./scale";
import { LabelProjector, LabelsContext } from "./labels";
import type { Label3D } from "./labels";
import styles from "./Scene3D.module.css";

interface Scene3DProps {
    children: React.ReactNode;
    /** Accessible description of what the scene shows. */
    label: string;
    /** Legend strip under the scene (kept off the canvas so it never hides the data). */
    legend?: React.ReactNode;
    /** Initial camera position; the target is the centre of the world box. */
    camera?: [number, number, number] | undefined;
}

const TARGET: [number, number, number] = [0, HEIGHT * 0.32, 0];
const DEFAULT_CAMERA: [number, number, number] = [3.0, 2.25, 3.3];

/**
 * Shared 3D stage: fixed lighting, a camera that can orbit but never flip under
 * the floor or wander off, a DOM label layer and a button to return to the
 * initial view.
 */
const Scene3D: React.FC<Scene3DProps> = ({ children, label, legend, camera = DEFAULT_CAMERA }) => {
    const t = useT("common");
    const controls = useRef<OrbitControlsImpl>(null);
    const elements = useRef(new Map<string, HTMLDivElement>());
    const [groups, setGroups] = useState<Record<string, Label3D[]>>({});

    const publish = useCallback((group: string, labels: Label3D[]) => {
        setGroups((prev) => (prev[group] === labels ? prev : { ...prev, [group]: labels }));
    }, []);

    const labelsContext = useMemo(() => ({ publish, elements: elements.current }), [publish]);
    const labels = useMemo(() => Object.values(groups).flat(), [groups]);

    return (
        <LabelsContext.Provider value={labelsContext}>
            <div className={styles.scene}>
                <div className={styles.stage} role="img" aria-label={label}>
                    <Canvas
                        camera={{ position: camera, fov: 36, near: 0.1, far: 50 }}
                        dpr={[1, 2]}
                        gl={{ antialias: true, alpha: true }}
                        onCreated={({ gl }) => {
                            gl.localClippingEnabled = true;
                        }}
                    >
                        <ambientLight intensity={0.85} />
                        <directionalLight position={[3, 5, 2]} intensity={1.5} />
                        <directionalLight position={[-3, 2, -2]} intensity={0.55} />
                        {children}
                        <LabelProjector labels={labels} />
                        <OrbitControls
                            ref={controls}
                            target={TARGET}
                            enablePan={false}
                            enableDamping
                            dampingFactor={0.12}
                            minDistance={2.4}
                            maxDistance={7}
                            minPolarAngle={0.2}
                            maxPolarAngle={Math.PI / 2 - 0.06}
                        />
                    </Canvas>

                    <div className={styles.labels} aria-hidden>
                        {labels.map((l) => (
                            <div
                                key={l.key}
                                ref={(el) => {
                                    if (el) elements.current.set(l.key, el);
                                    else elements.current.delete(l.key);
                                }}
                                className={l.variant === "title" ? styles.labelTitle : styles.labelTick}
                            >
                                {l.text}
                            </div>
                        ))}
                    </div>

                    <button
                        type="button"
                        className={styles.reset}
                        onClick={() => controls.current?.reset()}
                        title={t.chart3d.resetView}
                        aria-label={t.chart3d.resetView}
                    >
                        <Icon name="reset" size={14} />
                    </button>
                    <p className={styles.hint} aria-hidden>
                        {t.chart3d.dragHint}
                    </p>
                </div>

                {legend && <div className={styles.legend}>{legend}</div>}
            </div>
        </LabelsContext.Provider>
    );
};

export default Scene3D;
