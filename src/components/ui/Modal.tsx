import { useEffect, type ReactNode } from "react";

export type ModalSize = "sm" | "md" | "lg" | "xl";

export interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	title?: ReactNode;
	footer?: ReactNode;
	size?: ModalSize;
	closeOnBackdrop?: boolean;
	children?: ReactNode;
}

const Modal = ({
	isOpen,
	onClose,
	title,
	footer,
	size = "md",
	closeOnBackdrop = true,
	children,
}: ModalProps) => {
	// Close on Escape key
	useEffect(() => {
		if (!isOpen) return;

		const handleKey = (event: KeyboardEvent) => {
			if (event.key === "Escape") onClose();
		};

		document.addEventListener("keydown", handleKey);
		document.body.style.overflow = "hidden";

		return () => {
			document.removeEventListener("keydown", handleKey);
			document.body.style.overflow = "";
		};
	}, [isOpen, onClose]);

	if (!isOpen) return null;

	return (
		<div
			aria-modal="true"
			className="ui-modal-overlay"
			role="dialog"
			onClick={closeOnBackdrop ? onClose : undefined}
		>
			<div
				className={`ui-modal ui-modal--${size}`}
				onClick={(e) => e.stopPropagation()}
			>
				<div className="ui-modal__header">
					{title && <h3 className="ui-modal__title">{title}</h3>}
					<button
						aria-label="Close modal"
						className="ui-modal__close"
						type="button"
						onClick={onClose}
					>
						&#x2715;
					</button>
				</div>

				{children && <div className="ui-modal__body">{children}</div>}

				{footer && <div className="ui-modal__footer">{footer}</div>}
			</div>
		</div>
	);
};

export default Modal;
