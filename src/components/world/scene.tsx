import { Mesh, Group, Canvas } from "@/three/exports";
import React, { Suspense, useEffect, useRef, useState, useMemo } from "react";
import { ActionName } from "@/types/actions.js";
import { useSceneStore } from "@/hooks/use-scene-store";
import CharacterController from "../ui/character-controller";
import CameraRig from "./camera-rig";
import UIControls from "../ui/ui-controls";
import { cameraConfigs } from "@/hooks/use-camera-store";
import TrainCar from "./scenes/TrainCar";
import DanceFloor from "./scenes/DanceFloor";
import SubwayEntrance from "./scenes/SubwayEntrance";

const MemoizedUIControls = React.memo(UIControls);
interface SceneProps {
	language: "en" | "es";
}

export default function Scene({ language }: SceneProps) {
	const { currentScene, setCurrentScene } = useSceneStore();
	const [cameraConfig, setCameraConfig] = useState(
		cameraConfigs[currentScene]
	);
	const sceneRef = useRef<Group>(null);

	useEffect(() => {
		setCameraConfig(cameraConfigs[currentScene]);
	}, [currentScene]);

	const [animationName, setAnimationName] = useState<ActionName>("HappyIdle");

	// Clean up and dispose of unused objects
	useEffect(() => {
		const currentSceneRef = sceneRef.current;

		return () => {
			if (currentSceneRef) {
				currentSceneRef.traverse((child) => {
					if (child instanceof Mesh) {
						child.geometry.dispose();
						if (Array.isArray(child.material)) {
							child.material.forEach((mat) => mat.dispose());
						} else {
							child.material.dispose();
						}
					}
				});
			}
		};
	}, [currentScene]);

	const SceneComponent = useMemo(() => {
		switch (currentScene) {
			case "SubwayEntrance":
				return (
					<SubwayEntrance modelUrl="/models/subway-entrance.glb" />
				);
			case "DanceFloor":
				return <DanceFloor />;
			case "TrainCar":
				return <TrainCar modelUrl="/models/train.glb" />;
			default:
				return null;
		}
	}, [currentScene]);

	return (
		<>
			<div className="flex flex-col fixed bottom-[95px] left-0 right-0 mx-auto max-w-xl z-50">
				<MemoizedUIControls
					currentScene={currentScene}
					language={language}
					setAnimationName={setAnimationName}
					setCurrentScene={setCurrentScene}
				/>
			</div>
			<div className="fixed z-0 top-0 h-screen w-screen">
				<Canvas shadows>
					<color attach="background" args={["#020202"]} />
					<Suspense fallback={null}>
						{SceneComponent}
						<CharacterController animationName={animationName} />
					</Suspense>
					<CameraRig
						position={cameraConfig.position}
						lookAt={cameraConfig.lookAt}
						fov={cameraConfig.fov}
						v={cameraConfig.v}
					/>
				</Canvas>
			</div>
		</>
	);
}
