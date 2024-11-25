import { Sphere } from "@/three/exports";

export default function StreetLights() {
	return (
		<>
			<group position={[3, 0, -10]}>
				<pointLight
					position={[0, 4, 3]}
					intensity={25}
					distance={4}
					decay={0.1}
					color="yellow"
					castShadow
					shadow-bias={-0.01}
				/>
				<ambientLight intensity={0.25} />
			</group>
			<group position={[2.85, 0, -1.75]}>
				<pointLight
					position={[0, 5, 1]}
					intensity={25}
					distance={9}
					decay={0.1}
					color="yellow"
					castShadow
					shadow-bias={-0.01}
				/>
				<Sphere scale={0.1} visible={false}>
					<meshStandardMaterial color="yellow" />
				</Sphere>
				<ambientLight intensity={0.25} />
			</group>
		</>
	);
}
