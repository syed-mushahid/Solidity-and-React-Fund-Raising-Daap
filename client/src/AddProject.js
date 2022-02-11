import React from "react";
import CrowdFunding from "./contracts/Crowdfunding.json";
import { useState } from "react";
import { FileUpload } from "react-ipfs-uploader";
import Web3 from "web3";
export default function (props) {
  const [userAddress, setuserAddress] = useState();
  const [userBalance, setuserBalance] = useState();
  const [inputs, setInputs] = useState({});
  const [emergency, setemergency] = useState(false);
  let [Usd, setUsd] = React.useState(null);
  const [fileUrl, setFileUrl] = useState("");

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
  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };
  const handleChecked = (event) => {
    const name = event.target.name;
    let value;
    if (event.target.checked == true) {
      value = true;
    } else {
      value = false;
    }

    setemergency(value);
  };
  const web3 = new Web3(window.ethereum);
  async function handleSubmit(event) {
    event.preventDefault();
    let address = await web3.eth.getAccounts();
    if (address[0] != null) {
      setuserAddress(address[0]);
    } else {
      window.location.href = "/";
    }
    let networkId = await web3.eth.net.getId();

    if (address.length > 0) {
      let balance = await web3.eth.getBalance(address[0]);
      balance = web3.utils.fromWei(balance, "ether") + "ETH";
      setuserBalance(balance);
    }

    const Contract = new web3.eth.Contract(
      CrowdFunding.abi,
      CrowdFunding.networks[networkId].address
    );

    let unixDate = new Date(inputs.deadline).getTime() / 1000;
    console.log(unixDate);
    try {
      let perUSDToEth = 1 / Usd;
      let totalUSDtoEth = perUSDToEth * inputs.fundTarget;
      let amountinWei = web3.utils.toWei(String(totalUSDtoEth), "ether");
      Contract.methods
        .CreateProject(
          inputs.projectTitle,
          inputs.projectDesc,
          inputs.category,
          amountinWei,
          unixDate,
          emergency,
          fileUrl
        )
        .send({ from: address[0] });
    } catch (e) {
      console.log("Mf Error" + e);
    }
  }

  return (
    <>
      {
        <div className="col-md-8 m-auto my-5">
          <form>
            <div class="mb-3">
              <label for="projectTitle" class="form-label">
                Project Title
              </label>
              <input
                type="text"
                name="projectTitle"
                class="form-control"
                onChange={handleChange}
                id="projectTitle"
              />
            </div>
            <div class="mb-3">
              <label for="projectDesc" class="form-label">
                Project Description
              </label>
              <textarea
                class="form-control"
                name="projectDesc"
                onChange={handleChange}
                id="projectDesc"
                rows="3"
              ></textarea>
            </div>
            <div class="mb-3">
              <label for="fundtarget" class="form-label">
                Fund Target In USD
              </label>
              <input
                type="number"
                name="fundTarget"
                onChange={handleChange}
                class="form-control"
                id="fundtarget"
              />
            </div>
            <div class="mb-3">
              <label for="deadline" class="form-label">
                Project DeadLine
              </label>
              <input
                type="date"
                name="deadline"
                onChange={handleChange}
                class="form-control"
                id="deadline"
              />
            </div>
            <div class="mb-3">
              <select
                name="category"
                onChange={handleChange}
                class="form-select"
                aria-label="Default select example"
              >
                <option selected disabled>
                  Select Project Category
                </option>
                <option value="Education">Education</option>
                <option value="Health">Health</option>
                <option value="Nature">Nature</option>
                <option value="Technology">Technology</option>
                <option value="Food">Food</option>
                <option value="Charity">Charity</option>
                <option value="Others">Others</option>
              </select>
            </div>

            <div class="mb-3">
              <label for="upload Thumbnail" class="form-label">
                Upload Thumbnail
              </label>
            </div>
            <div class="form-check my-3">
              <input
                onChange={handleChecked}
                class="form-check-input"
                type="checkbox"
                id="flexCheckIndeterminate"
              />
              <label
                class="form-check-label"
                name="emergency"
                for="flexCheckIndeterminate"
              >
                Add In Emergency Projects "[3% fee]"
              </label>
            </div>
          </form>
          <div className="my-3">
            <FileUpload setUrl={setFileUrl} />
          </div>
          <button
            onClick={handleSubmit}
            className="px-5 btn btn-primary mx-3"
            type="submit"
          >
            Submit
          </button>
        </div>
      }
    </>
  );
}
