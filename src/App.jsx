import BlobAnimation from "./components/BlobAnimation";
import Head from "./components/Head";
import Wrapper from "./components/Wrapper";
import View from "./components/View";
import Nav from "./components/Nav";
import Authenticate from "./components/Authenticate";
import "./index.css";

function App() {
  //Hooks

  return (
    <div className="main-container">
        
        {/* <Head />
        <Wrapper>
        <View />
        <Nav />
        </Wrapper> */}
        <BlobAnimation />
        <Authenticate/>
    </div>
    
  );
}

export default App;
