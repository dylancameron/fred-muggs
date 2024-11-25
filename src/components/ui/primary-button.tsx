import { ReactNode, ButtonHTMLAttributes, FC, memo } from "react";

// Extend the props to include all button attributes
interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	children?: ReactNode;
}

// Use React.memo to prevent unnecessary re-renders
const PrimaryButton: FC<PrimaryButtonProps> = memo(
	({ children, className = "", type = "button", onClick, ...props }) => {
		return (
			<button
				type={type}
				className={`bg-primary rounded-md px-4 py-2 ${className}`}
				onClick={onClick}
				{...props} // Spread the rest of the button attributes
			>
				{children}
			</button>
		);
	}
);

PrimaryButton.displayName = "PrimaryButton"; // Optional: for better debugging in React DevTools

export default PrimaryButton;
