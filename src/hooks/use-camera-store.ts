import { Vector3 } from "@/three/exports";
import { create } from "zustand";
import { SceneName } from "@/types/scenes";

export const cameraConfigs = {
	SubwayEntrance: {
		position: new Vector3(0, 2, 10),
		fov: 50,
		v: new Vector3(0, 10, 0),
		lookAt: new Vector3(0, 0, 0),
	},
	DanceFloor: {
		position: new Vector3(0, 0, 10),
		fov: 60,
		v: new Vector3(0, 0, 0),
		lookAt: new Vector3(0, 0, 0),
	},
	TrainCar: {
		position: new Vector3(0, -1, 12),
		fov: 45,
		v: new Vector3(0, 10, 0),
		lookAt: new Vector3(0, 1, 0),
	},
};

const useCameraStore = create((set) => ({
	currentScene: "SubwayEntrance" as SceneName, // Ensure the initial value is typed as SceneName
	setCurrentScene: (scene: SceneName) => {
		// Explicitly type the parameter as SceneName
		set({ currentScene: scene });
	},
}));

export default useCameraStore;
