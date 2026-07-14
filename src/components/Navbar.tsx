import { NavLink } from "react-router-dom";

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
				<nav aria-label="Quick links" className="navbar-links">
					<NavLink
						className={({ isActive }) =>
							`navbar-link ${isActive ? "navbar-link-active" : ""}`
						}
						to="/dashboard"
					>
						Dashboard
					</NavLink>
					<NavLink
						className={({ isActive }) =>
							`navbar-link ${isActive ? "navbar-link-active" : ""}`
						}
						to="/reports"
					>
						Reports
					</NavLink>
					<NavLink
						className={({ isActive }) =>
							`navbar-link ${isActive ? "navbar-link-active" : ""}`
						}
						to="/reports/history"
					>
						Reports History
					</NavLink>
				</nav>
				<span className="navbar-badge">Live</span>
			</div>
		</header>
	);
};

export default Navbar;
