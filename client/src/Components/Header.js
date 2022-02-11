import React, { Component } from "react";
import { useState, useEffect } from "react";
import Web3 from "web3";
import { Link } from "react-router-dom";
import $ from "jquery";

export default function Header() {
  const [userAddress, setuserAddress] = useState(null);
  let [searchQuery, setsearchQuery] = useState(null);
  const web3 = new Web3(window.ethereum);
  useEffect(() => {
    async function userConnectCheck() {
      let address = await web3.eth.getAccounts();
      setuserAddress(address[0]);
      let networkId = await web3.eth.net.getId();
      //////Network Should Be RinkeBy//
    }

    const interval = setInterval(() => {
      userConnectCheck();
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // window.ethereum.on('networkChanged', function (networkId) {
  //   // Time to reload your interface with the new networkId
  // })
  async function connectMetamask() {
    if (window.ethereum) {
      try {
        // Request account access if needed
        await window.ethereum.enable();

        let networkId = await web3.eth.net.getId();
        //   if (networkId != "4") {
        //     alert("Kindly Use Rinkeby Test Network Account In Meta Mask");
        //   } else {
        //     let address = await web3.currentProvider.selectedAddress;
        //     setuserAddress(address);
        //   }
      } catch (error) {}
    } else {
      alert("Meta Mask Extention Not Found");
    }
  }
  $(function () {
    $(document).scroll(function () {
      var $nav = $(".sticky-top");

      $(".nav-link").toggleClass(
        "changefont",
        $(this).scrollTop() > $nav.height()
      );
      $nav.toggleClass("scrolled", $(this).scrollTop() > $nav.height());
    });
  });

  function getQuery() {
    let _value = $("#searchQuery").val();
    setsearchQuery(_value);
  }
  return (
    <>
      <nav className="navbar sticky-top navbar-expand-lg navbar-dark  topHeader">
        <div id="topNav" className="container ">
          <Link to="/" id="logo" className="navbar-brand">
            DROP
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link
                  to="/AddProject.js"
                  className="nav-link active"
                  aria-current="page"
                >
                  <i class="fas fa-plus"></i> Project
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/" className="nav-link active">
                  Explore Projects
                </Link>
              </li>

              <li className="nav-item">
                <Link to="/Profile" className="nav-link active">
                  Profile
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/About" className="nav-link active">
                  About
                </Link>
              </li>
            </ul>
            <form className="d-flex">
              <input
                className="form-control me-2"
                type="search"
                placeholder="Search"
                aria-label="Search"
                id="searchQuery"
                onChange={getQuery}
              />
              <Link to={"SearchResults/" + searchQuery}>
                <button className="btn btn-outline-danger">Search</button>
              </Link>
            </form>
          </div>
          {userAddress == null ? (
            <button onClick={connectMetamask} className="btn btn-primary mx-3">
              Connect Meta Mask
            </button>
          ) : (
            <button onClick={connectMetamask} className="btn btn-success mx-3">
              Connected
            </button>
          )}
        </div>
      </nav>
    </>
  );
}
