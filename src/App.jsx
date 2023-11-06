import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Head />
      <Wrapper>
        <View />
        <Nav />
      </Wrapper>
    </>
  )
}

export default App
