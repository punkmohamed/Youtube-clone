
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import Home from './pages/Home';
import Detail from "./pages/Detail";
import Layout from "./layouts/Layouts";
import { useState } from "react";

const App = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');

  return (
    <>
      <Router>
        <Layout setSearchQuery={setSearchQuery}>
          <Routes>
            <Route path="/" element={<Home searchQuery={searchQuery} />} />
            <Route path="/watch/:id" element={<Detail />} />
          </Routes>
        </Layout>
      </Router>
    </>
  )
}

export default App