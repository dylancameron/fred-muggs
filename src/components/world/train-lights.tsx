import React from "react";

interface TrainLightsProps {
	shadowBias?: number;
	distance?: number;
	decay?: number;
	intensity?: number;
	color?: string;
	helperVisible?: boolean;
}

const TrainLights: React.FC<TrainLightsProps> = ({
	shadowBias = -0.001,
	distance = 25,
	decay = 0.5,
	intensity = 1.5,
	color = "yellow",
}) => {
	const leftTrackLightPosition = 4;
	const leftBias = 0.45;
	const rightTrackLightPosition = 4;
	const rightBias = 0.45;
	const pointHeight = 6;
	const shadowMapSize = 2048;

	return (
		<>
			<fog attach="fog" args={["black", 10, 50]} />
			<ambientLight intensity={3} />
			<pointLight
				position={[
					(leftTrackLightPosition * leftBias) / 2,
					pointHeight,
					0,
				]}
				intensity={intensity}
				color={color}
				distance={distance}
				decay={decay}
				castShadow
				shadow-bias={shadowBias}
				shadow-mapSize-width={shadowMapSize}
				shadow-mapSize-height={shadowMapSize}
			/>
			<pointLight
				position={[
					(rightTrackLightPosition * rightBias) / 2,
					pointHeight - 1,
					0,
				]}
				intensity={intensity}
				color={color}
				distance={distance}
				decay={decay}
				castShadow
				shadow-bias={shadowBias}
				shadow-mapSize-width={shadowMapSize}
				shadow-mapSize-height={shadowMapSize}
			/>
		</>
	);
};

export default TrainLights;
