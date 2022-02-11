import React from "react";
import Header from "./Components/Header";
import AddProject from "./AddProject";
import Home from "./Home";
import Project from "./Project";
import Profile from "./Profile";
import About from "./About";
import SearchResults from "./SearchResults";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
export default function App() {
  const [Usd, setUsd] = React.useState(null);

  React.useEffect(() => {
    fetch(
      "https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=USD,ETH&api_key=aae1e27465cb6802074be1feb78996a52bf042cae91ac6f5c1badbd0b9af992b"
    )
      .then((res) => {
        return res.json();
      })

      .then((data) => {
        let ethtoUsd = data.USD / data.ETH;
        setUsd(ethtoUsd);
      });
  }, []);

  return (
    <>
      <Router>
        <Header />
        <Routes>
          <Route exact path="/" element={<Home Usd={Usd} />} />

          <Route
            exact
            path="/AddProject.js"
            element={<AddProject Usd={Usd} />}
          />
          <Route exact path="/Project/:id" element={<Project Usd={Usd} />} />
          <Route exact path="/Profile" element={<Profile Usd={Usd} />} />
          <Route exact path="/About" element={<About Usd={Usd} />} />
          <Route
            exact
            path="/SearchResults/:search"
            element={<SearchResults Usd={Usd} />}
          />
        </Routes>
      </Router>
    </>
  );
}
