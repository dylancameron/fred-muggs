import { EffectComposer, Bloom, DepthOfField } from "@/three/exports";

export function TraincarEffects() {
	return (
		<EffectComposer>
			<Bloom
				luminanceThreshold={0.9}
				luminanceSmoothing={0.1}
				height={1000}
			/>
			<DepthOfField
				target={[5, 0, 0]}
				focalLength={0.05}
				bokehScale={15}
			/>
		</EffectComposer>
	);
}
