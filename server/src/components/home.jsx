import { NavLink } from 'react-router-dom';

export default function Home() {
    return (
        <main className="home">
            <section className="home__hero">
                <div className="home__heroInner">
                    <span className="home__badge">CRM</span>
                    <h1 className="home__title">
                        Manage clients.<br />
                        <span className="home__titleAccent">Simple & secure.</span>
                    </h1>
                    <p className="home__subtitle">
                        Sign in or create an account to access your dashboard and keep your customer list in one place.
                    </p>
                    <div className="home__heroActions">
                        <NavLink to="/register" className="home__cta home__cta--primary">
                            Get started
                        </NavLink>
                        <NavLink to="/login" className="home__cta home__cta--secondary">
                            Sign in
                        </NavLink>
                    </div>
                </div>
                <div className="home__heroVisual" aria-hidden="true">
                    <div className="home__blob home__blob--1" />
                    <div className="home__blob home__blob--2" />
                    <div className="home__blob home__blob--3" />
                </div>
            </section>

            <section className="home__features">
                <h2 className="home__featuresTitle">What you get</h2>
                <div className="home__grid">
                    <article className="home__card">
                        <div className="home__cardIcon" aria-hidden="true">📋</div>
                        <h3 className="home__cardTitle">Dashboard</h3>
                        <p className="home__cardText">
                            Search and view all your clients in one place. Filter by name or email.
                        </p>
                        <NavLink to="/dashboard" className="home__cardLink">
                            Go to dashboard →
                        </NavLink>
                    </article>

                    <article className="home__card">
                        <div className="home__cardIcon" aria-hidden="true">🔐</div>
                        <h3 className="home__cardTitle">Secure access</h3>
                        <p className="home__cardText">
                            Stay signed in until you sign out. Use the header to move between pages anytime.
                        </p>
                    </article>

                    <article className="home__card home__card--dark">
                        <div className="home__cardIcon" aria-hidden="true">✨</div>
                        <h3 className="home__cardTitle">Quick tips</h3>
                        <ul className="home__list">
                            <li>Header: Home, Login, Register, Dashboard, Sign out</li>
                            <li>Dashboard search filters clients by name or email</li>
                            <li>Admins can create new clients from the dashboard</li>
                        </ul>
                    </article>
                </div>
            </section>
        </main>
    );
}
