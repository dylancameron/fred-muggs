import { create } from "zustand";
import { persist, PersistStorage } from "zustand/middleware";
import { SceneName } from "@/types/scenes";

interface SceneState {
	currentScene: SceneName;
	nextScene: SceneName | null;
	transitionInProgress: boolean;
	setCurrentScene: (scene: SceneName) => void;
	setNextScene: (scene: SceneName) => void;
	preloadScene: (scene: SceneName) => void;
}

// Custom storage implementation
const customStorage: PersistStorage<SceneState> = {
	getItem: async (name: string) => {
		const item = localStorage.getItem(name);
		return item ? JSON.parse(item) : null;
	},
	setItem: async (name: string, value: unknown) => {
		localStorage.setItem(name, JSON.stringify(value));
	},
	removeItem: async (name: string) => {
		localStorage.removeItem(name);
	},
};

export const useSceneStore = create<SceneState>()(
	persist(
		(set) => ({
			currentScene: "DanceFloor",
			nextScene: null,
			transitionInProgress: false,
			setCurrentScene: (scene) => set({ currentScene: scene }),
			setNextScene: (scene) => set({ nextScene: scene }),
			preloadScene: async (scene: SceneName) => {
				try {
					await import(`../components/world/scenes/${scene}.tsx`);
				} catch {
					console.error(`Failed to preload scene: ${scene}.tsx`);
				}
			},
		}),
		{
			name: "scene-storage",
			storage: customStorage,
		}
	)
);
