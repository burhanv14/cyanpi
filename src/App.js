import React from 'react'
import Header from "./components/header";
import Footer from "./components/footer";
import Home from "./components/home";
import Spline from '@splinetool/react-spline';



function App() {
  return (
      <div>
        <Spline scene="https://prod.spline.design/nOq060s-5MXh7yH8/scene.splinecode" 
        frameBorder="0"
        width="100%"
        height="100%"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: -1, // Ensure it's behind other content
        }}
        allowFullScreen/>
      <Header />
      <Home />
      <Footer />
    </div>
  )
}

export default App