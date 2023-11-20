import BlobAnimation from "./components/BlobAnimation";
import Head from './components/Head';
import Wrapper from './components/Wrapper';
import View from './components/View';
import Nav from './components/Nav';
import Authenticate from './components/Authenticate';
import UserContext from './contexts/user.context';
import { useContext, useEffect } from 'react';
import "./index.css";
import AddTransacForm from "./components/AddTransacForm";

function App() {

  const { user, setUser } = useContext(UserContext);

  const checkConnection = async () => {
    const response = await fetch('http://localhost/finance-flow/backend/authentication.php?check-auth=true', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Accept': 'application/json'
      }
    });
    const data = await response.json();
    if (data.success) {
      setUser({
        id: data.user.id,
        email: data.user.email,
        isAuth: true,
      });
    }
  }

  useEffect(() => {
    checkConnection();
  }, []);

  return (
    <div className="main-container">
      <Head />
      <Wrapper>
        <View />
        <Nav />
      </Wrapper>
      {/* <BlobAnimation /> */}
      {!user.isAuth && <Authenticate />}
    </div>
  )
}

export default App;
