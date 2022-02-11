import React from "react";
import { web3, Contract, EthToUSD } from "./utils";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Zoom from "react-reveal/Zoom";
export default function Profile(props) {
  const [MyDonations, setMydonations] = useState();
  const [userAddress, setuserAddress] = useState(null);
  const [userBalance, setuserBalance] = useState();
  const [owner, setowner] = useState(false);
  let [projects, setprojects] = useState([]);
  const [ProjectState, setProjectState] = useState(0);
  /////////first check if user have meta ask or connected withmeta mask///
  useEffect(async () => {
    let address = await web3.eth.getAccounts();
    setuserAddress(address[0]);
    if (address.length > 0) {
      let balance = await web3.eth.getBalance(address[0]);
      balance = web3.utils.fromWei(balance, "ether");
      setuserBalance(balance);
    } else {
      window.location.href = "/";
    }
    let data = await Contract.methods.getDonationData(address[0]).call();
    setMydonations(data);

    try {
      let project = await Contract.methods.getProjects().call();
      setprojects(project);
    } catch (e) {
      console.log(" Error" + e);
    }
  }, [][ProjectState]);

  window.ethereum.on("accountsChanged", function () {
    window.location.reload();
  });
  function getTime(unixtime) {
    let date = new Date(unixtime * 1000);
    let day = date.getUTCDate();
    let month = date.getUTCMonth() + 1;
    let year = date.getFullYear();
    return day + "-" + month + "-" + year;
  }
  async function refundDonation(projectId, refundId) {
    Contract.methods
      .refund(projectId, refundId)
      .send({ value: 0, from: userAddress });
    setProjectState(ProjectState + 1);
  }
  function wihtdrawProject(_projectId) {
    Contract.methods.withDrawFunds(_projectId).send({ from: userAddress });
    setProjectState(ProjectState + 1);
  }

  return (
    <>
      {userAddress && (
        <div className="container">
          <div className="col-12">
            <div className="profileInfo">
              <h2>Your Profile</h2>
              {userAddress && <h3>ADDRESS : {userAddress}</h3>}
              {userBalance && <h3>Balance : {userBalance + " ETH"}</h3>}
            </div>
            <Zoom cascade>
              <div className="myprojects col-12">
                <h2 className="col-12 text-center">Your Projects</h2>
                <table class="table table-hover">
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Project Title</th>
                      <th scope="col">Collected</th>
                      <th scope="col">Target</th>
                      <th scope="col">Dead Line</th>
                      <th scope="col">With Draw</th>
                    </tr>
                  </thead>
                  {projects &&
                    projects
                      .slice(0)
                      .reverse()
                      .map(function (data, Id) {
                        let deadline = getTime(data.deadline);
                        if (data.projectOwner == userAddress) {
                          return (
                            <>
                              <tbody>
                                <tr>
                                  <th scope="row">{Id + 1}</th>
                                  <td>
                                    <Link to={"/Project/" + data.projectID}>
                                      {data.projectTitle}
                                    </Link>
                                  </td>
                                  <td>
                                    {EthToUSD(data.currentBalance, props.Usd)} $
                                  </td>
                                  <td>{EthToUSD(data.target, props.Usd)} $</td>
                                  <td>{deadline}</td>
                                  <td>
                                    {data.compaignStatus == 0 ? (
                                      <button className="btn btn-danger">
                                        Pending
                                      </button>
                                    ) : (
                                      " "
                                    )}
                                    {data.compaignStatus == 1 ? (
                                      <button className="btn btn-danger">
                                        Pending
                                      </button>
                                    ) : (
                                      " "
                                    )}
                                    {data.compaignStatus == 2 ? (
                                      <button
                                        onClick={() =>
                                          wihtdrawProject(data.projectID)
                                        }
                                        className="btn btn-success"
                                      >
                                        WithDraw
                                      </button>
                                    ) : (
                                      " "
                                    )}
                                    {data.compaignStatus == 3 ? (
                                      <button className="btn btn-success">
                                        Collected
                                      </button>
                                    ) : (
                                      " "
                                    )}
                                  </td>
                                </tr>
                              </tbody>
                            </>
                          );
                        }
                      })}{" "}
                </table>{" "}
              </div>{" "}
            </Zoom>
          </div>

          <h2 className="col-12 my-3 mb-5 text-center">
            Your Donations History
          </h2>
          <div className="recipts-row flex-wrap row d-flex justify-content-between align-items-stretch">
            {MyDonations &&
              MyDonations.slice(0)
                .reverse()
                .map(function (data, Id) {
                  let deadline = getTime(data.projectDeadline);
                  let donatedOn = getTime(data.donationTime);

                  return (
                    <>
                      <div className="receipt-wrapper col-md-6 col-lg-4 mb-4">
                        <div className="receipt">
                          <header className="receipt__header">
                            <p className="receipt__title">
                              {data.projectTitle}
                            </p>
                            <p className="receipt__date">
                              Donated on : {donatedOn}
                            </p>
                          </header>
                          <div className="receipt__list">
                            <div className="receipt__list-row">
                              <dt className="receipt__item">Amount</dt>
                              <dd className="receipt__cost">
                                {EthToUSD(data.donationAmount, props.Usd)} $
                              </dd>
                            </div>
                            <div className="receipt__list-row">
                              <dt className="receipt__item">IN ETH</dt>
                              <dd className="receipt__cost">
                                {data.donationAmount / 1000000000000000000} ETH
                              </dd>
                            </div>

                            <div className="receipt__list-row">
                              <dt className="receipt__item">Gas Fee</dt>
                              <dd className="receipt__cost"></dd>
                            </div>
                            <div className="receipt__list-row">
                              <dt className="receipt__item">
                                Project Deadline
                              </dt>
                              <dd className="receipt__cost">{deadline}</dd>
                            </div>
                            <div className="receipt__list-row receipt__list-row--total">
                              <dt className="receipt__item">Total</dt>
                              <dd className="receipt__cost">
                                {EthToUSD(data.donationAmount, props.Usd)} $
                              </dd>
                            </div>
                          </div>
                          {data.donationStatus == 0 ? (
                            <button
                              onClick={() =>
                                refundDonation(
                                  data.projectId,
                                  MyDonations.length - 1 - Id
                                )
                              }
                              className="btn btn-danger col-12"
                            >
                              Refund Donation
                            </button>
                          ) : (
                            <button className="btn btn-success col-12">
                              Refunded
                            </button>
                          )}
                        </div>
                      </div>
                    </>
                  );
                })}
          </div>
        </div>
      )}
    </>
  );
}
