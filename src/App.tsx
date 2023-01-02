import { useState, useEffect } from 'react';
import './App.scss';
import { Link, Outlet } from "react-router-dom";
import { Button, Drawer, SelectChangeEvent, StyledEngineProvider } from '@mui/material';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import SiteSettings from './components/SiteSettings';
import CloseIcon from '@mui/icons-material/Close';
import { COLOR_THEMES } from './constants/constants';


function App() {
  const [colorTheme, setColorTheme] = useState<COLOR_THEMES>(COLOR_THEMES.DEFAULT)
  const [openDrawer, setOpenDrawer] = useState(false);

  useEffect(() => {
    const classEnding = '-theme'
    const classes = document.body.className;

    if (classes.length > 0) {
      document.body.classList.remove(classes)
    }
    switch (colorTheme) {
      case COLOR_THEMES.DARK:
        document.body.classList.add(COLOR_THEMES.DARK + classEnding)
        break;
      case COLOR_THEMES.HACKER:
        document.body.classList.add(COLOR_THEMES.HACKER + classEnding)
        break;
      case COLOR_THEMES.TROPICAL:
        document.body.classList.add(COLOR_THEMES.TROPICAL + classEnding)
        break;
      default:
        break;
    }
  }, [colorTheme])

  const handleThemeChange = (event: SelectChangeEvent) => {
    setColorTheme(event.target.value as COLOR_THEMES);
  };

  const toggleDrawer = () => {
    setOpenDrawer(!openDrawer)
  }
  return (
    <StyledEngineProvider injectFirst>
      <div>
        <header className='navigation'>
          <nav className='navigation__page-links' >
            <Link className='navigation__link' to="/">Home</Link>
            <Link className='navigation__link' to="/projects">Projects</Link>
          </nav>
          <Button className="drawer__toggle" onClick={toggleDrawer}><SettingsOutlinedIcon></SettingsOutlinedIcon></Button>
        </header>
        <main className='main-container'>
          <Outlet></Outlet>
          <Drawer open={openDrawer} onClose={() => setOpenDrawer(false)} className="drawer">
            <Button className="drawer__close" onClick={() => setOpenDrawer(false)}> <CloseIcon></CloseIcon></Button>
            <SiteSettings theme={colorTheme} setTheme={handleThemeChange}></SiteSettings>
          </Drawer>
        </main>
        <footer></footer>
      </div>
    </StyledEngineProvider>
  );
}

export default App;
