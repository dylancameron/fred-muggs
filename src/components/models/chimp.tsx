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
		const isKeyPressed = useRef(false);

		const { nodes, materials, animations } = useGLTF(
			modelUrl
		) as unknown as CustomGLTF;

		const { actions, mixer } = useAnimations(animations, group);

		// Spacebar for Pause/Resume
		useEffect(() => {
			const handleKeyDown = (e: KeyboardEvent) => {
				if (e.code === "Space" && currentAction.current) {
					isKeyPressed.current = true;

					isPaused.current = !isPaused.current;
					currentAction.current.paused = isPaused.current;
				}
			};
			const handleKeyUp = (e: KeyboardEvent) => {
				if (e.code === "Space") {
					isKeyPressed.current = false;
				}
			};

			document.addEventListener("keydown", handleKeyDown);
			document.addEventListener("keyup", handleKeyUp);
			return () => {
				document.removeEventListener("keydown", handleKeyDown);
				document.removeEventListener("keyup", handleKeyUp);
			};
		}, []);

		// Play Idle Animation on Mount
		useEffect(() => {
			const idleAction = actions[idleAnimationName];
			if (idleAction) {
				idleAction.fadeIn(0.5).play().setLoop(LoopRepeat, Infinity);
				currentAction.current = idleAction; // Set the idle action as the active one
			}

			return () => {
				// Clean up on unmount
				Object.values(actions).forEach((action) => action?.stop());
				mixer.stopAllAction();
			};
		}, [actions, idleAnimationName, mixer]);
		// Handle Animation Changes
		useEffect(() => {
			const newAction = actions[animationName];

			// Stop the current animation if it exists
			if (currentAction.current && currentAction.current !== newAction) {
				currentAction.current.fadeOut(0.5).stop();
			}

			// Play the new animation
			if (newAction) {
				newAction.reset().fadeIn(0.5).play();
				newAction.clampWhenFinished = true;
				newAction.setLoop(LoopOnce, 1);
				currentAction.current = newAction; // Update the active action

				// Reset paused state on animation change
				isPaused.current = false;
			}
		}, [animationName, actions]);

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
