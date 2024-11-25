import React, { useEffect, useRef, useMemo } from "react";
import { Mesh, MeshReflectorMaterial, Sphere } from "@/three/exports";
import SpotLights from "../spot-lights";
import StreetLights from "../street-lights";

export default function DanceFloor() {
	const floor = useRef<Mesh>(null);

	// Optimize bounding box calculations
	useEffect(() => {
		if (floor.current) {
			floor.current.geometry.computeBoundingBox();
		}
	}, []); // Only runs once on mount

	const reflectorMaterialProps = useMemo(
		() => ({
			mirror: 1,
			blur: [3000, 3000] as [number, number],
			resolution: 2048,
			mixBlur: 1,
			mixStrength: 100,
			roughness: 1,
			depthScale: 0.05,
			minDepthThreshold: 0.4,
			maxDepthThreshold: 1.4,
			color: "#505050",
			metalness: 0.9,
		}),
		[]
	);

	return (
		<>
			<mesh
				position={[0, -2, 0]}
				receiveShadow
				castShadow
				rotation={[-Math.PI / 2, 0, 0]}
				ref={floor}
			>
				<planeGeometry args={[50, 50]} />
				<MeshReflectorMaterial {...reflectorMaterialProps} />
			</mesh>
			<MemoizedLighting />
		</>
	);
}

// Memoize the Lighting component to avoid unnecessary re-renders
const Lighting = () => {
	const shadowBias = -0.005;
	return (
		<>
			<SpotLights
				color1="lightblue"
				color2="yellow"
				position1={[5, 25, -5]}
				position2={[-5, 25, -5]}
			/>
			<StreetLights />
			<directionalLight
				position={[0, 1, 5]}
				intensity={1}
				shadow-bias={shadowBias}
				castShadow
			/>
			<group position={[0, 1, 0]}>
				<pointLight
					intensity={15}
					distance={7}
					decay={0.1}
					color="yellow"
					castShadow
					shadow-bias={-1}
				/>
				<Sphere scale={1} visible={false}>
					<meshStandardMaterial color="yellow" />
				</Sphere>
				<directionalLight
					position={[0, 5, 0]}
					intensity={0.2}
					color="white"
					castShadow
					shadow-bias={shadowBias}
				/>
			</group>
		</>
	);
};

const MemoizedLighting = React.memo(Lighting);
