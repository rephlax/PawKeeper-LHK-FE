import logo from "../assets/logo.png"
const HomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full space-y-4">
      <h1>Welcome to PawKeeper</h1>
      <img className="w-40 h-40" src={logo} alt="Pawkeeper logo" />
    </div>
  );
};

export default HomePage;
