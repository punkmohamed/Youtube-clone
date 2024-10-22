
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import Home from './pages/Home';
import Detail from "./pages/Detail";
import Layout from "./layouts/Layouts";
import YoutubeProfile from "./pages/youtubeProfile";
import Shorts from "./pages/Shorts";
import Trending from "./pages/Trending";

const App = () => {

  return (
    <>
      <Router>
        <Layout >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/watch/:id" element={<Detail />} />
            <Route path="/:name/:id" element={<YoutubeProfile />} />
            <Route path="/shorts/:id" element={<Shorts />} />
            <Route path="/feed/trending" element={<Trending />} />
          </Routes>
        </Layout>
      </Router>
    </>
  )
}

export default App