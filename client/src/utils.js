import CrowdFunding from "./contracts/Crowdfunding.json";
import Web3 from "web3";

export const web3 = new Web3(window.ethereum); 
export const Contract = new web3.eth.Contract(
  CrowdFunding.abi,
  CrowdFunding.networks[5777].address
);

export const EthToUSD = (amount, usd) => {
  const etherValue = Web3.utils.fromWei(amount, "ether");
  const ethToUSD = etherValue * usd;
  return ethToUSD.toFixed(2);
};
