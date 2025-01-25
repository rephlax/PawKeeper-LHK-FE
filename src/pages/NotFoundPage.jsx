import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div>
      <div>
        <p>Page is not found</p>
        <img src="#" alt="#" />
        <Link to="/">Home</Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
