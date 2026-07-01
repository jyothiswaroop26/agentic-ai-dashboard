type NavbarProps = {
	onMenuClick: () => void;
};

const Navbar = ({ onMenuClick }: NavbarProps) => {
	return (
		<header className="navbar">
			<div className="navbar-left">
				<button
					aria-label="Open sidebar"
					className="menu-toggle"
					onClick={onMenuClick}
					type="button"
				>
					<span />
					<span />
					<span />
				</button>
				<h1 className="navbar-title">Agentic AI Dashboard</h1>
			</div>

			<div className="navbar-right">
				<span className="navbar-badge">Live</span>
			</div>
		</header>
	);
};

export default Navbar;
