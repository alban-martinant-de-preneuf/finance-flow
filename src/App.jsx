import BlobAnimation from "./components/BlobAnimation";
import Head from './components/Head';
import Wrapper from './components/Wrapper';
import View from './components/View';
import Authenticate from './components/Authenticate';
import UserContext from './contexts/user.context';
import { useContext, useEffect, useState } from 'react';
import "./index.css";
import Foot from "./components/Foot";

function App() {

  const { user, setUser } = useContext(UserContext);
  const [update, setUpdated] = useState(0);

  const updateChart = () => {
    console.log('updating chart');
    setUpdated(prev => prev + 1);
  }

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
      {!user.isAuth && <Authenticate />}
      <Wrapper>
        <Head />
      </Wrapper>
      <Wrapper>
        <View update={update} />
      </Wrapper>
      <Wrapper>
        <Foot updateChart={updateChart} />
      </Wrapper>
      <BlobAnimation />
    </div>
  )
}

export default App;
