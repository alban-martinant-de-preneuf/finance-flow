import { useContext } from 'react';
import UserContext from '../contexts/user.context';

export default function Head() {

    const { user } = useContext(UserContext);

    return (
        <header>
            <h1>MoneyMinder</h1>
            {user.isAuth && <p>Welcome {user.email}</p>}
        </header>
    )
}