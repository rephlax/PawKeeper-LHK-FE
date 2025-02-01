import { Link } from "react-router-dom";
import logo from "../assets/logo.png"

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">
          <img src={logo} alt="PawKeeper Logo" className="logo" />
        </Link>
      </div>

      <div className="navbar-links">
        <Link to="/signup" className="navbar-link">
          Sign up
        </Link>
        <Link to="/login" className="navbar-link">
          Log in
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
