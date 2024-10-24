import Footer from "./Components/Layout/Footer";

import "../node_modules/react-vis/dist/style.css";
import "./App.css";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "./Style/custom.scss";

const Layout = ({ children = <></> }) => {
  return (
    <main className="bg-light min-vh-100 text-dark text-center p-md-5 p-2">
      <div className="p-md-5 p-2 pt-5">{children}</div>

      <Footer />
    </main>
  );
};

export default Layout;
