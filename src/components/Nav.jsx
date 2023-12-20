export default function Nav({ handleLogout, setSectionToShow }) {
    return (
        <nav>
            <ul className="nav-list">
                <li onClick={() => setSectionToShow('home')} className="nav-element">
                    Home
                </li>
                <li onClick={() => setSectionToShow('history')} className="nav-element">
                    History
                </li>
                <li onClick={handleLogout} className="nav-element">
                    Logout
                </li>
            </ul>
        </nav>
    )
}