import {
	Group,
	MeshStandardMaterial,
	MeshPhysicalMaterial,
	SkinnedMesh,
	AnimationClip,
	Bone,
	useGLTF,
	useAnimations,
	GLTFThree,
	LoopOnce,
	LoopRepeat,
} from "@/three/exports";
import React, { useEffect, useRef } from "react";
import { ActionName } from "@/types/actions";
import * as THREE from "three";

interface GLTFAction extends AnimationClip {
	name: ActionName;
}

interface CustomGLTF extends GLTFThree {
	nodes: {
		blacksuit: SkinnedMesh;
		body: SkinnedMesh;
		mixamorigHips: Bone;
	};
	materials: {
		["4_Object06_0.1_16_16.001"]: MeshPhysicalMaterial;
		defaultmat: MeshStandardMaterial;
	};
	animations: GLTFAction[];
}

interface ModelProps {
	modelUrl: string;
	animationName: ActionName;
	idleAnimationName: ActionName;
	scale?: number | [number, number, number];
	position?: [number, number, number];
}
const ChimpModel = React.memo(
	({ modelUrl, animationName, idleAnimationName, ...props }: ModelProps) => {
		const group = useRef<Group>(null);
		const currentAction = useRef<THREE.AnimationAction | null>(null);
		const isPaused = useRef(false);
		const previousAnimationName = useRef<string | null>(null);

		const { nodes, materials, animations } = useGLTF(
			modelUrl
		) as unknown as CustomGLTF;

		const { actions, mixer } = useAnimations(animations, group);

		// Handle Spacebar for pause/resume
		useEffect(() => {
			const handleKeyDown = (e: KeyboardEvent) => {
				if (e.code === "Space" && currentAction.current) {
					isPaused.current = !isPaused.current;
					if (currentAction.current) {
						currentAction.current.paused = isPaused.current;
					}
				}
			};

			window.addEventListener("keydown", handleKeyDown);

			return () => {
				window.removeEventListener("keydown", handleKeyDown);
			};
		}, []);

		// Play idle animation on mount
		useEffect(() => {
			const idleAction = actions[idleAnimationName];
			if (idleAction) {
				idleAction
					.reset()
					.fadeIn(0.5)
					.play()
					.setLoop(LoopRepeat, Infinity);
				currentAction.current = idleAction; // Track idle as the active action
				previousAnimationName.current = idleAnimationName;
			}

			return () => {
				Object.values(actions).forEach((action) => action?.stop());
				mixer.stopAllAction();
			};
		}, [actions, idleAnimationName, mixer]);
		// Handle animation changes
		useEffect(() => {
			// Skip if the animation hasn't changed
			if (previousAnimationName.current === animationName) return;

			const action = actions[animationName];
			const idleAction = actions[idleAnimationName];

			// Clean up previous action
			if (currentAction.current && currentAction.current !== idleAction) {
				currentAction.current.fadeOut(0.5);
			}

			if (action) {
				// Transition from idle to the selected animation
				idleAction?.fadeOut(0.5);
				action.reset().fadeIn(0.5).play();
				action.clampWhenFinished = true;
				action.setLoop(LoopOnce, 1);
				currentAction.current = action;
				previousAnimationName.current = animationName;

				// Transition back to idle after completion
				const handleFinished = () => {
					if (!isPaused.current && idleAction) {
						idleAction
							.reset()
							.fadeIn(0.5)
							.play()
							.setLoop(LoopRepeat, Infinity);
						currentAction.current = idleAction;
					}
				};

				mixer.addEventListener("finished", handleFinished);
				return () => {
					mixer.removeEventListener("finished", handleFinished);
				};
			}
		}, [animationName, actions, idleAnimationName, mixer]);

		return (
			<group ref={group} {...props} dispose={null}>
				<group name="Scene">
					<group
						name="Chimp"
						rotation={[Math.PI / 2, 0, 0]}
						scale={0.158}
					>
						<skinnedMesh
							name="blacksuit"
							geometry={nodes.blacksuit.geometry}
							material={materials["4_Object06_0.1_16_16.001"]}
							skeleton={nodes.blacksuit.skeleton}
							castShadow
						/>
						<skinnedMesh
							name="body"
							castShadow
							geometry={nodes.body.geometry}
							material={materials.defaultmat}
							skeleton={nodes.body.skeleton}
						/>
						<primitive object={nodes.mixamorigHips} />
					</group>
				</group>
			</group>
		);
	}
);

useGLTF.preload("/models/chimp.glb");

export { ChimpModel };
