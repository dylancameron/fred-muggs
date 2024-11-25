import React, { useEffect, useMemo } from "react";
import { Mesh, useGLTF } from "@/three/exports";
import StreetLights from "../street-lights";

interface SubwayEntranceProps {
	modelUrl: string;
}

const SubwayEntrance = React.memo(({ modelUrl }: SubwayEntranceProps) => {
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

	const SceneComponent = useMemo(
		() => (
			<group
				position={[0, -2, -6]}
				rotation={[0, Math.PI / 2, 0]}
				scale={3}
				castShadow
				receiveShadow
			>
				<primitive object={scene} castShadow receiveShadow />
			</group>
		),
		[scene]
	);

	return (
		<>
			{SceneComponent}
			<Lighting />
		</>
	);
});

useGLTF.preload("/models/subway-entrance.glb");

const Lighting = () => {
	return (
		<>
			<ambientLight intensity={1.5} />
			<StreetLights />
		</>
	);
};

export default SubwayEntrance;
