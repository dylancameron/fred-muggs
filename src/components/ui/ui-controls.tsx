import React, { useEffect, useState } from "react";
// import { formatName } from '@/hooks/useFormatNames';
import { SceneName } from "@/types/scenes";
import { ActionName } from "@/types/actions";
import { actionMap } from "@/constants/action-map";
import { sceneMap } from "@/constants/scene-map";

interface UIControlsProps {
	currentScene: SceneName;
	setAnimationName: (action: ActionName) => void;
	setCurrentScene: (scene: SceneName) => void;
	language: "en" | "es";
}

export default function UIControls({
	currentScene,
	setAnimationName,
	setCurrentScene,
	language = "en",
}: UIControlsProps) {
	const actionEntries = Object.entries(actionMap[language]);
	const actions = actionEntries.map(([, action]) => action);

	const sceneEntries = Object.entries(sceneMap[language]);
	const scenes = sceneEntries.map(([, scene]) => scene);

	const [activeAction, setActiveAction] = useState<ActionName>(actions[0]);
	const [activeScene, setActiveScene] = useState<SceneName>(scenes[0]);

	// Update activeScene when currentScene prop changes
	useEffect(() => {
		setActiveScene(currentScene);
	}, [currentScene]);

	// Cycle to the next action
	const handleNextAction = () => {
		const currentIndex = actions.findIndex(
			(action) => action === activeAction
		);
		const nextIndex = (currentIndex + 1) % actions.length;
		const nextAction = actions[nextIndex];
		setActiveAction(nextAction);
		setAnimationName(nextAction);
	};

	// Cycle to the next scene
	const handleNextScene = () => {
		const currentIndex = scenes.findIndex((scene) => scene === activeScene);
		const nextIndex = (currentIndex + 1) % scenes.length;
		const nextScene = scenes[nextIndex];
		setActiveScene(nextScene);
		setCurrentScene(nextScene);
	};

	useEffect(() => {
		window.addEventListener("keydown", (e) => {
			if (e.code === "ArrowRight") {
				handleNextAction();
			}
		});
		window.addEventListener("keydown", (e) => {
			if (e.code === "ArrowLeft") {
				handleNextScene();
			}
		});

		return () => {
			window.removeEventListener("keydown", (e) => {
				if (e.code === "ArrowRight") {
					handleNextAction();
				}
			});
			window.removeEventListener("keydown", (e) => {
				if (e.code === "ArrowLeft") {
					handleNextScene();
				}
			});
		};
	});

	return (
		<>
			<div className="m-1 flex justify-center items-start gap-2 flex-wrap px-1">
				<button
					type="button"
					className="hidden border-1 border-transparent whitespace-nowrap flex-1 bg-black/50 backdrop-blur-sm text-white p-0.5 rounded-md hover:bg-opacity-20 active:bg-white/5"
					onClick={handleNextAction}
				>
					<span className="text-center text-xs">Change Dance</span>
				</button>
				<button
					type="button"
					className="hidden border-1 border-transparent whitespace-nowrap flex-1 bg-black/90 backdrop-blur-sm text-white p-0.5 rounded-md hover:bg-opacity-20 active:bg-white/5"
					onClick={handleNextScene}
				>
					<span className="text-center text-xs">Change Scene</span>
				</button>
			</div>
		</>
	);
}
