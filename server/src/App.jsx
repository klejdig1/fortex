import { BrowserRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import Dashboard from './components/Dashboard.jsx';
import { AuthProvider, useAuth } from './AuthProvider.jsx';

function Home() {
    const { user } = useAuth();
    if (!user) return <Navigate to="/login" />;
    return <Dashboard />;
}

export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <div className="container">
                    <header className="header">
                        <a href="/home" className="logo-link">
                            <img 
                                className="logo" 
                                src="/images.png" 
                                alt="Fortex Logo" 
                            />
                        </a>

                        <nav className="nav">
                            <NavLink
                                to="/home"
                                className={({ isActive }) =>
                                    isActive ? "btn-nav active" : "btn-nav"
                                }
                            >
                                Home
                            </NavLink>
                            <NavLink
                                to="/login"
                                className={({ isActive }) =>
                                    isActive ? "btn-nav active" : "btn-nav"
                                }
                            >
                                Login
                            </NavLink>
                            <NavLink
                                to="/register"
                                className={({ isActive }) =>
                                    isActive ? "btn-nav active" : "btn-nav"
                                }
                            >
                                Register
                            </NavLink>
                        </nav>
                    </header>

                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                    </Routes>
                </div>
            </BrowserRouter>
        </AuthProvider>
    );
}