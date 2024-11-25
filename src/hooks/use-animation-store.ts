import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ActionName } from "@/types/actions";

interface AnimationState {
	animationName: ActionName;
	setAnimationName: (animation: ActionName) => void;
}

export const useAnimationStore = create<AnimationState>()(
	persist(
		(set) => ({
			animationName: "HappyIdle",
			setAnimationName: (action) => set({ animationName: action }),
		}),
		{
			name: "animation-storage",
		}
	)
);
