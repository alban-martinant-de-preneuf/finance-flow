import Head from './components/Head';
import Wrapper from './components/Wrapper';
import View from './components/View';
import Nav from './components/Nav';
import Authenticate from './components/Authenticate';
import UserContext from './contexts/user.context';
import { useContext } from 'react';

function App() {

  const { user } = useContext(UserContext);

  return (
    <>
      <Head />
      <Wrapper>
        <View />
        <Nav />
      </Wrapper>
      {!user.isAuth && <Authenticate />}
    </>
  )
}

export default App
