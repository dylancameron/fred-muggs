import { FC, Suspense, useMemo, memo } from "react";
import { ChimpModel } from "@/components/models/chimp";
import { ActionName } from "@/types/actions";

interface CharacterControllerProps {
	animationName: ActionName;
}

const CharacterController: FC<CharacterControllerProps> = memo(
	({ animationName }) => {
		// Use useMemo to avoid creating new references for props on each render
		const modelProps = useMemo(
			() => ({
				modelUrl: "/models/chimp.glb",
				position: [0, -2, 2] as [number, number, number],
				scale: 0.158 as number,
				idleAnimationName: "Idle",
			}),
			[]
		);
		return (
			<Suspense fallback={null}>
				<ChimpModel
					{...modelProps}
					idleAnimationName="Idle"
					animationName={animationName}
				/>
			</Suspense>
		);
	}
);

export default CharacterController;
