import Head from './components/Head';
import Wrapper from './components/Wrapper';
import View from './components/View';
import Nav from './components/Nav';
import Authenticate from './components/Authenticate';
function App() {

  //Hooks 


  return (
  
    <>
      <Head />
      <Wrapper>
        <View />
        <Nav />
      </Wrapper>
      <Authenticate/>
    </>
  )
}

export default App
