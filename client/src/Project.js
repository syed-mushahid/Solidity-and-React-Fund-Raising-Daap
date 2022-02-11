import React from "react";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Web3 from "web3";
import { Contract, web3, EthToUSD } from "./utils";
export default function Project(props) {
  const [status, setstatus] = useState();
  const [day, setday] = useState(0);
  const [hour, sethour] = useState(0);
  const [min, setmin] = useState(0);
  const [sec, setsec] = useState(0);
  const [target, settarget] = useState(0);
  const [current, setcurrent] = useState(0);
  let [project, setproject] = useState(0);
  const [donationAmount, setdonationAmount] = useState(0);
  let [collectedPercentage, setcollectedPercentage] = useState(0);
  const [ProjectState, setProjectState] = useState(0);
  let [timer, settimer] = useState(true);
  const { id } = useParams();
  function DonationAmount(e) {
    let amount = e.target.value;
    setdonationAmount(amount);
  }

  async function sendDonation() {
    try {
      let address = await web3.eth.getAccounts();
      let perUSDToEth = 1 / props.Usd;
      let totalUSDtoEth = perUSDToEth * donationAmount;
      let amountinWei = web3.utils.toWei(String(totalUSDtoEth), "ether");
      await Contract.methods
        .donateFund(project.projectID)
        .send({ value: amountinWei, from: address[0] });
      setProjectState(ProjectState + 1);
    } catch (e) {
      console.log(" Error" + e);
    }
  }

  let countDown;
  useEffect(async () => {
    try {
      let data = await Contract.methods.getSingleProject(id).call();
      setproject(data);
      let collected = (data.currentBalance / data.target) * 100;
      setcollectedPercentage(collected);
      countDown = new Date(data.deadline * 1000).getTime();
      setcurrent(EthToUSD(data.currentBalance, props.Usd));
      settarget(EthToUSD(data.target, props.Usd));
      if (data.compaignStatus == 0) {
        setstatus("Active");
      } else if (data.compaignStatus == 1) {
        setstatus("Target Achived");
      } else if (data.compaignStatus == 2) {
        setstatus("Expired");
      }
    } catch (e) {
      console.log(" Error" + e);
    }
    ///////Dead Line Timer///
    const second = 1000,
      minute = second * 60,
      hour = minute * 60,
      day = hour * 24;

    let x = setInterval(function () {
      const now = new Date().getTime(),
        distance = countDown - now;

      setday(Math.floor(distance / day));
      sethour(Math.floor((distance % day) / hour));
      setmin(Math.floor((distance % hour) / minute));
      setsec(Math.floor((distance % minute) / second));
      console.log(distance);
      //do something later when date is reached
      if (distance < 0) {
        settimer(false);
        clearInterval(x);
      }
      //seconds
    }, 0);
  }, [][ProjectState]);
  return (
    <>
      {project && (
        <div className="container mt-3 p-3">
          <div className="row m-3 d-flex justify-content-between">
            <div className="m-3 col-md-6 projectPageThumbnail">
              <h6>
                <b>Created By</b> : {project.projectOwner}
              </h6>
              <img
                className="postPageThumbnail mt-2"
                alt="thumbnail"
                src={project.thumbnail}
              />
              <div className="col-12 d-flex badge">
                <span style={{ width: "fit-content" }}>{project.category}</span>
                {project.emergency == true ? (
                  <span
                    style={{ width: "fit-content", marginLeft: "10px" }}
                    id="emergencyBadge"
                  >
                    Emergency
                  </span>
                ) : (
                  ""
                )}
              </div>
              <div className="col-12 mt-1">
                <h1>{project.projectTitle}</h1>
              </div>
              <div className="mt-1">
                <p>{project.projectDesc}</p>
              </div>
            </div>

            <div className="donationCard py-3 col-md-5">
              <h3 className="deadLineTimer text-center" id="headline">
                Drop A Donation For This Project
              </h3>
              {timer === true ? (
                <div id="countdown">
                  <ul>
                    <li className="countDown">
                      <span id="days">{day}</span> &nbsp; days
                    </li>
                    <li className="countDown">
                      <span id="hours">{hour}</span> &nbsp; Hours
                    </li>
                    <li className="countDown">
                      <span id="minutes">{min}</span> &nbsp; Minutes
                    </li>
                    <li className="countDown">
                      <span id="seconds">{sec}</span> &nbsp; Seconds
                    </li>
                  </ul>
                </div>
              ) : (
                " "
              )}
              <div className="col-12 d-flex">
                <h6 style={{ marginRight: "auto" }}>Status: {status}</h6>
                <h6 style={{ marginLeft: "auto" }}>Target: {target}$</h6>
              </div>
              <div className="progress">
                <div
                  className="progress-bar"
                  role="progressbar"
                  style={{ width: `${collectedPercentage}%` }}
                  aria-valuenow={collectedPercentage}
                  aria-valuemin={0}
                  aria-valuemax={100}
                ></div>
              </div>
              <div className="mt-2">
                <span className="text1">
                  {current} $ Contributed
                  <span className="text2">
                    &nbsp; By {project.contributorsNum} Donations
                  </span>
                </span>
              </div>
              {project.compaignStatus == 0 ? (
                <>
                  <div className="donateOptions my-2 d-flex justify-content-between">
                    <button
                      type="button"
                      onMouseDown={() => setdonationAmount(20)}
                      onClick={sendDonation}
                      class="btn m-1 donate-options btn-outline-success"
                    >
                      20$
                    </button>
                    <button
                      type="button"
                      onMouseDown={() => setdonationAmount(30)}
                      onClick={sendDonation}
                      class="btn m-1 donate-options btn-outline-success"
                    >
                      30$
                    </button>
                    <button
                      type="button"
                      onMouseDown={() => setdonationAmount(50)}
                      onClick={sendDonation}
                      class="btn m-1 donate-options btn-outline-success"
                    >
                      50$
                    </button>
                    <button
                      type="button"
                      onMouseDown={() => setdonationAmount(100)}
                      onClick={sendDonation}
                      class="btn m-1 donate-options btn-outline-success"
                    >
                      100$
                    </button>
                    <button
                      type="button"
                      onMouseDown={() => setdonationAmount(150)}
                      onClick={sendDonation}
                      class="btn m-1 donate-options btn-outline-success"
                    >
                      150$
                    </button>
                    <button
                      type="button"
                      onMouseDown={() => setdonationAmount(250)}
                      onClick={sendDonation}
                      class="btn m-1 donate-options btn-outline-success"
                    >
                      250$
                    </button>
                  </div>
                  <div class="mb-3">
                    <label for="DonationAmount" class="form-label">
                      Enter Amount In USD
                    </label>
                    <input
                      type="number"
                      onChange={DonationAmount}
                      onClick={DonationAmount}
                      class="rounded form-control"
                      id="DonationAmount"
                      placeholder="Enter Amount"
                    />
                  </div>
                  <button
                    onClick={sendDonation}
                    type="button"
                    class="btn rounded col-12 btn-primary"
                  >
                    <i class="fas fa-hand-holding-usd"></i> &nbsp; Donate Now
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  class="btn mt-5 rounded col-12 btn-primary"
                >
                  <i class="fas fa-hand-holding-usd"></i> &nbsp; Donaions Closed
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
