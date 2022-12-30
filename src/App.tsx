import React from 'react';
import './App.scss';
import { Link, Outlet } from "react-router-dom";


function App() {
  return (
    <div className="App default-theme">
      <header className='navigation'>
        <nav >
          <Link className='navigation__link' to="/">Home</Link>
          <Link className='navigation__link' to="/projects">Projects</Link>
        </nav>
      </header>
      <main className='main-container'>
        <Outlet></Outlet>
      </main>
      <footer></footer>
    </div>
  );
}

export default App;
