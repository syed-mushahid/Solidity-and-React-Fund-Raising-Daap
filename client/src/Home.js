import React from "react";
import { useState, useEffect } from "react";
import ProjectCard from "./Components/ProjectCard";
import { web3, Contract, EthToUSD } from "./utils";
import $ from "jquery";
import CountUp from "react-countup";
import Web3 from "web3";
import Emergency from "./Components/Emergency";
export default function Home(props) {
  let [projects, setprojects] = useState([]); ///to Store the All projects Data//
  const [projectTitle, setprojectTitle] = useState(); /////To use Project Title In Modal//
  const [projectID, setprojectID] = useState(-1); /////To Use Project ID in Modal///
  const [donationAmount, setdonationAmount] = useState(0); ///To Get The Donating Amount
  const [ProjectState, setProjectState] = useState(0);
  useEffect(async () => {
    try {
      let project = await Contract.methods.getProjects().call();
      setprojects(project);
    } catch (e) {
      console.log(" Error" + e);
    }
  }, [ProjectState]);

  $(document).on("click", ".donateNow", function () {
    ////Trigger When Clicked on The Hover Donation Button///
    let Title = $(this).attr("data-projectTitle");
    let ID = $(this).attr("data-projectId");
    setprojectTitle(Title);
    setprojectID(ID);
  });

  function DonationAmount(e) {
    /////Setting Donation Amount
    let amount = e.target.value;
    setdonationAmount(amount);
  }
  async function sendDonation() {
    ///Sending Donation TO Smart Contract
    try {
      if (projectID != -1) {
        let address = await web3.eth.getAccounts();
        let perUSDToEth = 1 / props.Usd;
        let totalUSDtoEth = perUSDToEth * donationAmount;
        let amountinWei = web3.utils.toWei(String(totalUSDtoEth), "ether");
        await Contract.methods
          .donateFund(projectID)
          .send({ value: amountinWei, from: address[0] });
        setProjectState(ProjectState + 1);
      }
    } catch (e) {
      console.log(" Error" + e);
    }
  }

  return (
    <>
      <div className="container-fluid Toplanding"></div>

      {projects && (
        <div className="container">
          <div className="emergencyProjects row mt-5 mb-4 d-flex justify-content-around">
            <h2>Emergency Projects</h2>

            {
              ///////To Show Latest Active Projects///////
              projects
                .slice(0)
                .reverse()
                .map(function (value) {
                  if (value.emergency == true) {
                    return (
                      <ProjectCard
                        creator={value.projectOwner}
                        createdOn={value.createdOn}
                        category={value.category}
                        projectTitle={value.projectTitle}
                        target={EthToUSD(value.target, props.Usd)}
                        collected={EthToUSD(value.currentBalance, props.Usd)}
                        contributorsNum={value.contributorsNum}
                        status={value.compaignStatus}
                        projectId={value.projectID}
                        deadline={value.deadline}
                        emergency={value.emergency}
                        thumbnail={value.thumbnail}
                      />
                    );
                  }
                })
            }
          </div>
          <div className="row mt-5 mb-4 d-flex justify-content-around">
            <h2 className="activeProjects">All Active Projects</h2>
            {
              ///////To Show Latest Active Projects///////
              projects
                .slice(0)
                .reverse()
                .map(function (value) {
                  if (value.compaignStatus == 0) {
                    return (
                      <ProjectCard
                        creator={value.projectOwner}
                        createdOn={value.createdOn}
                        category={value.category}
                        projectTitle={value.projectTitle}
                        target={EthToUSD(value.target, props.Usd)}
                        collected={EthToUSD(value.currentBalance, props.Usd)}
                        contributorsNum={value.contributorsNum}
                        status={value.compaignStatus}
                        projectId={value.projectID}
                        deadline={value.deadline}
                        emergency={value.emergency}
                        thumbnail={value.thumbnail}
                      />
                    );
                  }
                })
            }
            {
              ////////////////To Show Lasest Target Achived Projects////////
              projects
                .slice(0)
                .reverse()
                .map(function (value) {
                  if (value.compaignStatus == 1) {
                    return (
                      <ProjectCard
                        creator={value.projectOwner}
                        createdOn={value.createdOn}
                        category={value.category}
                        projectTitle={value.projectTitle}
                        target={EthToUSD(value.target, props.Usd)}
                        collected={EthToUSD(value.currentBalance, props.Usd)}
                        contributorsNum={value.contributorsNum}
                        status={value.compaignStatus}
                        projectId={value.projectID}
                        deadline={value.deadline}
                        emergency={value.emergency}
                        thumbnail={value.thumbnail}
                      />
                    );
                  }
                })
            }
            {
              ////////////////To Show Lasest Target Expired Projects////////
              projects
                .slice(0)
                .reverse()
                .map(function (value) {
                  if (value.compaignStatus == 2) {
                    return (
                      <ProjectCard
                        creator={value.projectOwner}
                        createdOn={value.createdOn}
                        category={value.category}
                        projectTitle={value.projectTitle}
                        target={EthToUSD(value.target, props.Usd)}
                        collected={EthToUSD(value.currentBalance, props.Usd)}
                        contributorsNum={value.contributorsNum}
                        status={value.compaignStatus}
                        projectId={value.projectID}
                        deadline={value.deadline}
                        emergency={value.emergency}
                        thumbnail={value.thumbnail}
                      />
                    );
                  }
                })
            }
          </div>

          <div
            class="modal fade"
            id="DonateModal"
            tabindex="-1"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="modalTitle">
                    Donate To : {projectTitle}
                  </h5>

                  <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div class="modal-body">
                  <form>
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
                      <label for="donationAmount" class="col-form-label">
                        Enter Amount In USD
                      </label>
                      <input
                        type="number"
                        onChange={DonationAmount}
                        onClick={DonationAmount}
                        class="form-control"
                        id="donationAmount"
                      />
                    </div>
                  </form>
                </div>
                <div class="modal-footer">
                  <button
                    type="button"
                    class="btn btn-secondary"
                    data-bs-dismiss="modal"
                  >
                    Close
                  </button>
                  <button
                    onClick={sendDonation}
                    type="button"
                    class="btn btn-primary"
                  >
                    Send Donations
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
