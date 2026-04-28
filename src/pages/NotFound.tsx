import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();
  useEffect(() => {
    console.error("404:", location.pathname);
  }, [location.pathname]);

  return (
    <section className="min-h-[60vh] flex items-center">
      <div className="container-dg text-center">
        <p className="overline mb-3">404</p>
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4">Page Not Found</h1>
        <p className="text-soft text-lg mb-8">The page you are looking for does not exist.</p>
        <Link to="/" className="btn-primary">Back to Home</Link>
      </div>
    </section>
  );
};

export default NotFound;
