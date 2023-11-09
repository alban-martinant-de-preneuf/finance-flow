import { useContext } from 'react';
import UserContext from '../contexts/user.context';

export default function Head() {

    const { user, setUser } = useContext(UserContext);

    const handleLogout = async () => {
        const response = await fetch('http://localhost/finance-flow/backend/authentication.php?logout=true', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Accept': 'application/json'
            }
        });
        const data = await response.json();
        if (data.success) {
            setUser({
                id: null,
                email: '',
                isAuth: false,
            });
        }
    }

    return (
        <header>
            <h1>MoneyMinder</h1>
            {user.isAuth && (
                <>
                    <p>Welcome {user.email}</p>
                    <button onClick={handleLogout}>Logout</button>
                </>
            )}
        </header>
    )
}