import { createContext, useState } from 'react';

const UserContext = createContext(null);

export default UserContext;

function UserContextProvider({ children }) {

    const [user, setUser] = useState({ 
        id: null,
        email: '',
        isAuth: false
    });

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
}

export { UserContextProvider };