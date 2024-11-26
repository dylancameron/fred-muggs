import { useRef } from "react";
import {
	useFrame,
	useThree,
	DreiLight,
	SpotLight,
	Vector3,
} from "@/three/exports";

interface SpotLightsProps {
	color1: string;
	color2: string;
	position1?: [number, number, number];
	position2?: [number, number, number];
}

export default function SpotLights({
	color1,
	color2,
	position1,
	position2,
}: SpotLightsProps) {
	const spotLight1 = useRef<SpotLight>(null);
	const spotLight2 = useRef<SpotLight>(null);
	const { pointer, viewport } = useThree();

	useFrame(() => {
		const pointerPosition = new Vector3(
			(pointer.x * viewport.width) / 2,
			(pointer.y * viewport.height) / 2,
			0
		);

		if (spotLight1.current && spotLight2.current) {
			const lightOffset = new Vector3(0, 0, 0); // Adjust offset as needed

			spotLight1.current.position.lerp(
				pointerPosition.clone().add(new Vector3(5, 20, -5)),
				0.01
			);
			spotLight1.current.target.position.lerp(
				pointerPosition.clone().add(lightOffset),
				0.01
			);
			spotLight1.current.target.updateMatrixWorld();

			spotLight2.current.position.lerp(
				pointerPosition.clone().add(new Vector3(-5, 20, -5)),
				0.01
			);
			spotLight2.current.target.position.lerp(
				pointerPosition.clone().add(lightOffset),
				0.01
			);
			spotLight2.current.target.updateMatrixWorld();
		}
	});

	return (
		<group position={[0, 0, 0]}>
			<DreiLight
				ref={spotLight1}
				castShadow
				position={position1 || [5, 10, -5]}
				volumetric={true}
				penumbra={0.1}
				anglePower={5}
				distance={1500}
				angle={1.5}
				radiusTop={0.1}
				radiusBottom={150}
				color={color1}
			/>
			<DreiLight
				ref={spotLight2}
				castShadow
				position={position2 || [-5, 10, -5]}
				volumetric={true}
				penumbra={0.1}
				anglePower={5}
				distance={1500}
				angle={1.5}
				radiusTop={0.1}
				radiusBottom={150}
				color={color2}
			/>
		</group>
	);
}
