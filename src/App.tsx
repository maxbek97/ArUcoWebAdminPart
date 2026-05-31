import React from 'react';
import logo from './logo.svg';
import './App.css';
import Mainpage from './pages/mainpage/mainpage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Authorization from './pages/authorizationpage/Authorization';

function App() {
return (
    <Router>
      <div className="App">
        <main>
          <Routes>
            {/* Главная страница */}
            <Route path="/control-panel" element={
                <Mainpage />
            } />

            {/* Страница авторизации */}
            <Route path="/" element={
              <Authorization/>
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
