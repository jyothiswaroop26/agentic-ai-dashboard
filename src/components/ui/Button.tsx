import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: ButtonVariant;
	size?: ButtonSize;
	loading?: boolean;
	leftIcon?: ReactNode;
	rightIcon?: ReactNode;
	children: ReactNode;
}

const Button = ({
	variant = "primary",
	size = "md",
	loading = false,
	leftIcon,
	rightIcon,
	children,
	disabled,
	className = "",
	...rest
}: ButtonProps) => {
	const classes = [
		"ui-btn",
		`ui-btn--${variant}`,
		`ui-btn--${size}`,
		loading ? "ui-btn--loading" : "",
		className,
	]
		.filter(Boolean)
		.join(" ");

	return (
		<button className={classes} disabled={disabled || loading} {...rest}>
			{loading ? (
				<span aria-hidden="true" className="ui-btn-spinner" />
			) : (
				leftIcon && <span className="ui-btn-icon">{leftIcon}</span>
			)}
			<span>{children}</span>
			{!loading && rightIcon && (
				<span className="ui-btn-icon">{rightIcon}</span>
			)}
		</button>
	);
};

export default Button;
