import React from 'react';
import logo from './logo.svg';
import './App.css';
import Mainpage from './pages/mainpage/mainpage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
return (
    <Router>
      <div className="App">
        <main>
          <Routes>
            {/* Главная страница */}
            <Route path="/" element={
                <Mainpage />
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
