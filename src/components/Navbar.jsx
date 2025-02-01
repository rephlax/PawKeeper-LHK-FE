import { Link } from "react-router-dom";
import logo from "../assets/logo.png"

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between h-full px-8">
      <div className="navbar-logo">
        <Link to="/">
          <img className="w-20 h-20" src={logo} alt="PawKeeper Logo" />
        </Link>
      </div>

      <div className="flex gap-4 justify-evenly items-center text-lg" style={{ paddingRight: '10px' }}>
        <Link to="/sign-up" className="navbar-link">
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
