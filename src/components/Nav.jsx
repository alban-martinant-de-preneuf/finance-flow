export default function Nav({ handleLogout }) {
    return (
        <nav>
            <ul className="nav-list">
                <li className="nav-element">
                    Home
                </li>
                <li className="nav-element">
                    History
                </li>
                <li onClick={handleLogout} className="nav-element">
                    Logout
                </li>
            </ul>
        </nav>
    )
}