import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";

type Vec3 = [number, number, number];

interface DescentPathProps {
    /** World position of every step of the run. */
    points: Vec3[];
    /** Index of the step currently shown. */
    current: number;
    color: string;
    ballColor: string;
    arrowColor: string;
}

const BALL_RADIUS = 0.045;
const LIFT = BALL_RADIUS * 0.9;
const UP = new THREE.Vector3(0, 1, 0);

/**
 * The optimiser as a ball rolling over the cost landscape: a trail of the steps
 * taken so far, a ring where it started, the ball easing towards the current
 * step, and an arrow pointing to where the next update will move it.
 */
const DescentPath: React.FC<DescentPathProps> = ({ points, current, color, ballColor, arrowColor }) => {
    const ball = useRef<THREE.Group>(null);
    const index = Math.min(Math.max(current, 0), points.length - 1);
    const target = points[index];
    const next = points[index + 1];

    const trail = useMemo(
        () => points.slice(0, index + 1).map(([x, y, z]) => [x, y + 0.012, z] as Vec3),
        [points, index]
    );

    const arrow = useMemo(() => {
        if (!target || !next) return null;
        const from = new THREE.Vector3(...target);
        const dir = new THREE.Vector3(...next).sub(from);
        const length = dir.length();
        if (length < 1e-4) return null;
        // Steps shrink near the minimum; keep the arrow readable without hiding that it shrinks.
        const shown = Math.min(0.42, Math.max(0.12, length * 2.2));
        dir.normalize();
        const tip = from.clone().addScaledVector(dir, shown);
        const quaternion = new THREE.Quaternion().setFromUnitVectors(UP, dir);
        const start = from.clone().addScaledVector(dir, BALL_RADIUS);
        return {
            line: [[start.x, start.y + LIFT, start.z], [tip.x, tip.y + LIFT, tip.z]] as Vec3[],
            tip: [tip.x, tip.y + LIFT, tip.z] as Vec3,
            quaternion,
        };
    }, [target, next]);

    // Ease the ball towards the current step so playback reads as motion, not jumps.
    useFrame((_, delta) => {
        const mesh = ball.current;
        if (!mesh || !target) return;
        const goal = new THREE.Vector3(target[0], target[1] + LIFT, target[2]);
        mesh.position.lerp(goal, 1 - Math.exp(-delta * 14));
    });

    if (!target) return null;
    const start = points[0];

    return (
        <group>
            {trail.length > 1 && <Line points={trail} color={color} lineWidth={3} />}

            {start && (
                <mesh position={[start[0], start[1] + 0.01, start[2]]} rotation={[-Math.PI / 2, 0, 0]}>
                    <ringGeometry args={[0.035, 0.05, 32]} />
                    <meshBasicMaterial color={color} side={THREE.DoubleSide} />
                </mesh>
            )}

            {arrow && (
                <group>
                    <Line points={arrow.line} color={arrowColor} lineWidth={3} />
                    <mesh position={arrow.tip} quaternion={arrow.quaternion}>
                        <coneGeometry args={[0.03, 0.08, 16]} />
                        <meshStandardMaterial color={arrowColor} />
                    </mesh>
                </group>
            )}

            <group ref={ball} position={[target[0], target[1] + LIFT, target[2]]}>
                <mesh>
                    <sphereGeometry args={[BALL_RADIUS, 32, 32]} />
                    <meshStandardMaterial color={ballColor} roughness={0.25} metalness={0.1} emissive={ballColor} emissiveIntensity={0.15} />
                </mesh>
                {/* Faint copy drawn without depth test: the ball stays findable when a slope hides it */}
                <mesh renderOrder={10}>
                    <sphereGeometry args={[BALL_RADIUS, 24, 24]} />
                    <meshBasicMaterial color={ballColor} transparent opacity={0.35} depthTest={false} depthWrite={false} />
                </mesh>
            </group>

            {/* Shadow of the ball on the floor, to read its position in the (w₁, w₂) plane */}
            <mesh position={[target[0], 0.004, target[2]]} rotation={[-Math.PI / 2, 0, 0]}>
                <circleGeometry args={[BALL_RADIUS * 0.9, 24]} />
                <meshBasicMaterial color={ballColor} transparent opacity={0.35} />
            </mesh>
        </group>
    );
};

export default DescentPath;
