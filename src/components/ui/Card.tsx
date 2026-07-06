import type { ReactNode } from "react";

export type CardVariant = "default" | "elevated" | "outlined";

export interface CardProps {
	title?: ReactNode;
	description?: ReactNode;
	footer?: ReactNode;
	variant?: CardVariant;
	className?: string;
	children?: ReactNode;
}

const Card = ({
	title,
	description,
	footer,
	variant = "default",
	className = "",
	children,
}: CardProps) => {
	const classes = ["ui-card", `ui-card--${variant}`, className]
		.filter(Boolean)
		.join(" ");

	return (
		<article className={classes}>
			{(title || description) && (
				<header className="ui-card__header">
					{title && <h3 className="ui-card__title">{title}</h3>}
					{description && (
						<p className="ui-card__description">{description}</p>
					)}
				</header>
			)}

			{children && <div className="ui-card__body">{children}</div>}

			{footer && <footer className="ui-card__footer">{footer}</footer>}
		</article>
	);
};

export default Card;
