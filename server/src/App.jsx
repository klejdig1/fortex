import { BrowserRouter, Routes, Route, NavLink, Navigate, useNavigate } from 'react-router-dom';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import Dashboard from './components/Dashboard.jsx';
import Home from './components/home.jsx';
import { AuthProvider, useAuth } from './AuthProvider.jsx';

function ProtectedDashboard() {
    const { user } = useAuth();
    if (!user) return <Navigate to="/login" />;
    return <Dashboard />;
}

function Layout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    return (
        <div className="container">
            <header className="header">
                    <NavLink to="/home" className="logo-link">
                        <img
                            className="logo"
                            src="/images.png"
                            alt="Fortex Logo"
                        />
                    </NavLink>

                    <nav className="nav">
                        <NavLink
                            to="/home"
                            className={({ isActive }) =>
                                isActive ? 'btn-nav active' : 'btn-nav'
                            }
                        >
                            Home
                        </NavLink>

                        {user ? (
                            <>
                                <NavLink
                                    to="/dashboard"
                                    className={({ isActive }) =>
                                        isActive ? 'btn-nav active' : 'btn-nav'
                                    }
                                >
                                    Dashboard
                                </NavLink>
                                <button
                                    type="button"
                                    className="btn-nav"
                                    onClick={async () => {
                                        await logout();
                                        navigate('/home', { replace: true });
                                    }}
                                >
                                Sign out
                                </button>
                            </>
                        ) : (
                            <>
                                <NavLink
                                    to="/login"
                                    className={({ isActive }) =>
                                        isActive ? 'btn-nav active' : 'btn-nav'
                                    }
                                >
                                    Login
                                </NavLink>
                                <NavLink
                                    to="/register"
                                    className={({ isActive }) =>
                                        isActive ? 'btn-nav active' : 'btn-nav'
                                    }
                                >
                                    Register
                                </NavLink>
                            </>
                        )}
                    </nav>
                </header>

            <Routes>
                <Route path="/" element={<Navigate to="/home" replace />} />
                <Route path="/home" element={<Home />} />
                <Route path="/dashboard" element={<ProtectedDashboard />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Routes>
        </div>
    );
}

export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Layout />
            </BrowserRouter>
        </AuthProvider>
    );
}