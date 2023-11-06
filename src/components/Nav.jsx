import NavBtn from './NavBtn';

export default function Nav() {
    return (
        <nav>
            <ul>
                <NavBtn type="home" />
                <NavBtn type="transactions" />
                <NavBtn type="recurrent" />
                <NavBtn type="settings" />
            </ul>
        </nav>
    )
}