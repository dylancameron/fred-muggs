import { Sphere } from "@/three/exports";

export default function StreetLights() {
	return (
		<>
			<group position={[3, 3, -10]}>
				<pointLight
					position={[0, 4, 3]}
					intensity={25}
					distance={5}
					decay={0.1}
					color="#fff9aa"
					shadow-mapSize-width={2048}
					shadow-mapSize-height={2048}
					castShadow
					shadow-bias={-0.0005}
				/>
				<ambientLight intensity={0.25} />
			</group>
			<group position={[2.85, 0, 0]}>
				<pointLight
					position={[0, 4, 0]}
					intensity={25}
					distance={9}
					decay={0.1}
					color="#dfd984"
					shadow-mapSize-width={2048}
					shadow-mapSize-height={2048}
					castShadow
					shadow-bias={-0.0005}
				/>
				<Sphere scale={0.1} visible={false}>
					<meshStandardMaterial color="yellow" />
				</Sphere>
				<ambientLight intensity={0.25} />
			</group>
			<ambientLight intensity={0.5} />
		</>
	);
}
