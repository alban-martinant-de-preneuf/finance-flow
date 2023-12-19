import BlobAnimation from "./components/BlobAnimation";
import Head from './components/Head';
import Wrapper from './components/Wrapper';
import View from './components/View';
import Authenticate from './components/Authenticate';
import UserContext from './contexts/user.context';
import { useContext, useEffect, useState } from 'react';
import "./index.css";
import Foot from "./components/Foot";
import AddTransacForm from "./components/AddTransacForm";

function App() {

  const { user, setUser } = useContext(UserContext);
  const [update, setUpdated] = useState(0);
  const [total, setTotal] = useState(0);
  const [showTransacForm, setShowTransacForm] = useState(false);
  const [transacType, setTransacType] = useState('');

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
      {showTransacForm && <AddTransacForm setShowTransacForm={setShowTransacForm} updateChart={updateChart} transacType={transacType} />}
      <Wrapper>
        <Head />
      </Wrapper>
      <section className="main-section">
      <Wrapper>
        <View update={update} setTotal={setTotal} total={total} />
      </Wrapper>
      <Wrapper>
        <Foot setShowTransacForm={setShowTransacForm} setTransacType={setTransacType} />
      </Wrapper>
      </section>
      {/* <BlobAnimation /> */}
    </div>
  )
}

export default App;
