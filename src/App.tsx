import { useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import History from "./pages/History";
import Reports from "./pages/Reports";
import "./styles/layout.css";

const App = () => {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);

	const toggleSidebar = () => {
		setIsSidebarOpen((previousState) => !previousState);
	};

	const closeSidebar = () => {
		setIsSidebarOpen(false);
	};

	return (
		<BrowserRouter>
			<div className="app-shell">
				<Navbar onMenuClick={toggleSidebar} />

				<div className="app-content-shell">
					<Sidebar isOpen={isSidebarOpen} onNavigate={closeSidebar} />

					{isSidebarOpen ? (
						<button
							aria-label="Close sidebar"
							className="sidebar-backdrop"
							onClick={closeSidebar}
							type="button"
						/>
					) : null}

					<main className="app-main">
						<Routes>
							<Route path="/" element={<Navigate replace to="/dashboard" />} />
							<Route path="/dashboard" element={<Dashboard />} />
							<Route path="/history" element={<History />} />
							<Route path="/reports" element={<Reports />} />
						</Routes>
					</main>
				</div>
			</div>
		</BrowserRouter>
	);
};

export default App;
