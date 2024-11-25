import React, { useEffect, useMemo } from "react";
import { useGLTF, Mesh } from "@/three/exports";
import TrainLights from "../train-lights";

interface TrainCarProps {
	modelUrl: string;
}

const TrainCar = React.memo(({ modelUrl }: TrainCarProps) => {
	const { scene } = useGLTF(modelUrl);

	// Set up shadows only once when the component mounts
	useEffect(() => {
		if (scene) {
			scene.traverse((child) => {
				if (child instanceof Mesh) {
					child.castShadow = true;
					child.receiveShadow = true;
				}
			});
		}
	}, [scene]);

	// Memoize the scene element to avoid re-creating it on each render
	const SceneContent = useMemo(
		() => (
			<group position={[2.5, -2.15, 8]} rotation={[0, 0.2, 0]}>
				<primitive object={scene} scale={1} />
			</group>
		),
		[scene]
	);

	return (
		<>
			{SceneContent}
			<TrainLights />
		</>
	);
});

// Preload the GLTF model to improve performance
useGLTF.preload("/models/train.glb");

export default TrainCar;
