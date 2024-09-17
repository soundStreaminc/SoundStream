
import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
export function AppHeader() {
    const [searchTerm, setSearchTerm] = useState('');

    const handleChange = (ev) => {
      setSearchTerm(ev.target.value);
    };
    return (
        <div className="app-header">
        <Link to="/">
        <img className="app-header-logo" src="img/spotifty.png" />
    </Link>
          {/* Home and Search */}
          <nav className="app-header-nav">
        <NavLink exact="true" to="/" className="app-header-icon home-icon">
          <i className="fas fa-home"></i> {<HomeIcon/>}
        </NavLink>

        {/* Search Bar */}
        <div className="search-bar">
          <i className="fas fa-search"></i> {<SearchIcon/>}
          <input
            type="text"
            placeholder="What do you want to play?"
            value={searchTerm}
            onChange={handleChange}
          />
        </div>

        {/* Shopping Cart Icon */}
        <div className="cart-icon">
          <i className="fas fa-shopping-cart"></i>
        </div>
      </nav>
            {/* Right-side buttons */}
            <div className="app-header-right">
        {/* <NavLink to="/premium" className="btn btn-premium">
          Explore Premium
        </NavLink> */}
        <NavLink to="/install" className="btn btn-install">
          Install App
        </NavLink>
        <div className="notification-icon">
          <i className="fas fa-bell"></i>
        </div>
        <div className="user-profile">
          {/* User Avatar */}
        </div>
      </div>
    </div>
    

    )
}