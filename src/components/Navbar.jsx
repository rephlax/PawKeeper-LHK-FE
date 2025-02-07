import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslation } from "react-i18next";

const Navbar = () => {
  const { t } = useTranslation();
  return (
    <nav className="flex items-center justify-between h-full px-8">
      <div className="navbar-logo">
        <Link to="/">
          <img className="w-20 h-20" src={logo} alt="PawKeeper Logo" />
        </Link>
      </div>

      <div
        className="flex gap-4 justify-evenly items-center text-lg"
        style={{ paddingRight: "10px" }}
      >
        <Link to="/sign-up" className="navbar-link">
        {t("navbar.signup")}
        </Link>
        <Link to="/log-in" className="navbar-link">
        {t("navbar.login")}
        </Link>
        <div>
          <LanguageSwitcher />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
