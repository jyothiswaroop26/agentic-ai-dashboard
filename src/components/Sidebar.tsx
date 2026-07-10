import { NavLink } from "react-router-dom";

type SidebarProps = {
	isOpen: boolean;
	onNavigate: () => void;
};

const sidebarItems = [
	{ label: "Dashboard", route: "/dashboard" },
	{ label: "Agent Status", route: "/agent-status" },
	{ label: "Research Request", route: "/research" },
	{ label: "History", route: "/history" },
	{ label: "Reports", route: "/reports" },
];

const Sidebar = ({ isOpen, onNavigate }: SidebarProps) => {
	return (
		<aside className={`sidebar ${isOpen ? "sidebar-open" : ""}`}>
			<nav aria-label="Primary" className="sidebar-nav">
				{sidebarItems.map((item) => (
					<NavLink
						className={({ isActive }) =>
							`sidebar-link ${isActive ? "sidebar-link-active" : ""}`
						}
						key={item.route}
						onClick={onNavigate}
						to={item.route}
					>
						{item.label}
					</NavLink>
				))}
			</nav>
		</aside>
	);
};

export default Sidebar;
