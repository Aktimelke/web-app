import Home from "./src/pages/home/Home.jsx";
import TopBar from "./src/components/topbar/TopBar.jsx";
import Single from "./src/pages/single/Single.jsx";
import Write from "./src/pages/write/Write.jsx";
import Settings from "./src/pages/settings/Settings.jsx";
import Login from "./src/pages/login/Login.jsx";
import Register from "./src/pages/register/Register.jsx";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useContext } from "react";
import { Context } from "./src/context/Context.js";
import Footer from "./footer.jsx";

function App() {
  const { user } = useContext(Context);
  return (
    <Router>
      <TopBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={user ? <Home /> : <Register />} />
        <Route path="/login" element={user ? <Home /> : <Login />} />
        <Route path="/write" element={user ? <Write /> : <Register />} />
        <Route path="/settings" element={user ? <Settings /> : <Register />} />
        <Route path="/post/:postId" element={<Single />} />
      </Routes>
      <Footer />
    </Router>
  );
}


export default App;