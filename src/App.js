import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './Pages/Layout/Layout';
import Home from './Pages/HomePage/Home';
import Convert from './Pages/ConvertPage/ConvertPage';
import './App.css'
import Hero from './Components/Hero/Hero';
import TextToSignPage from './Pages/ConvertPage/TextToSignPage';
function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path='/' element={<Home/>} />
          <Route path="translate" element={<Convert/>} />
          <Route path='texttosign' element={<TextToSignPage/>}/>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
