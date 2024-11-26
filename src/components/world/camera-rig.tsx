import {
	PerspectiveCamera,
	Vector3,
	useFrame,
	DreiCamera,
} from "@/three/exports";
import React, { useRef, useEffect } from "react";

interface CameraRigProps {
	position: Vector3;
	lookAt: Vector3;
	fov: number;
	v?: Vector3;
}

const CameraRig: React.FC<CameraRigProps> = ({
	position,
	lookAt,
	fov,
	v = new Vector3(),
	...props
}) => {
	const cameraRef = useRef<PerspectiveCamera>(null);
	const targetPosition = useRef(new Vector3());
	const targetLookAt = useRef(new Vector3());

	useEffect(() => {
		if (cameraRef.current) {
			targetPosition.current.copy(position);
			targetLookAt.current.copy(lookAt);
		}
	}, [position, lookAt]);

	useFrame(({ camera, clock }) => {
		if (cameraRef.current) {
			const t = clock.getElapsedTime();
			const smoothFactor = 0.02; // Adjust this value for smoother or faster transitions

			// Smoothly interpolate camera position
			camera.position.lerp(targetPosition.current, smoothFactor);

			// Smoothly interpolate camera lookAt
			camera.lookAt(targetLookAt.current);

			if (camera instanceof PerspectiveCamera) {
				camera.fov = fov;
				camera.updateProjectionMatrix();
			}

			if (v) {
				camera.position.x += Math.sin(t / 5) * 0.1;
				camera.position.z += Math.cos(t / 5) * 0.05;
				camera.lookAt(lookAt);
			}
		}
	});

	return (
		<DreiCamera
			ref={cameraRef}
			position={position.toArray()}
			fov={fov}
			up={[0, 1, 0]}
			{...props}
		/>
	);
};

export default CameraRig;
