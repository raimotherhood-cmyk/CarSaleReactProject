import { Outlet } from 'react-router-dom';

function Layout() {
    return (
        <>
            <header>
                <h1>My App Header</h1>
                <nav>
                    {/* Navigation links */}
                </nav>
            </header>
            <main>
                <Outlet /> {/* This is where the specific page content will be rendered */}
            </main>
            <footer>
                <p>&copy; 2025 My App</p>
            </footer>
        </>
    );
}

export default Layout;