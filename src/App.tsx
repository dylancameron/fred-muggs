import Scene from "@/components/world/scene";
import "./global.css";
import { Suspense } from "react";

function App() {
	return (
		<Suspense>
			<Scene language="en" />
		</Suspense>
	);
}

export default App;
