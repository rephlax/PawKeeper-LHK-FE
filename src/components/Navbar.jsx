import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">
          <img src="#" alt="PawKeeper Logo" className="logo" />
        </Link>
      </div>

      <div className="navbar-links">
        <Link to="/sign-up" className="navbar-link">
          Sign up
        </Link>
        <Link to="/log-in" className="navbar-link">
          Log in
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
