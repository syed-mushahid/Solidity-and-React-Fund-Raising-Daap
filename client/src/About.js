import React from "react";
import { web3, Contract, EthToUSD } from "./utils";
import { useEffect, useState } from "react";
import { data } from "jquery";

export default function About(props) {
  const [info, setinfo] = useState(null);
  useEffect(async () => {
    let data = await Contract.methods.getContractInfo().call();
    setinfo(data);
    console.log("Total WithDraw AMount");
    console.log(data[5]);
    console.log(EthToUSD(data[5], props.Usd));
  }, []);
  console.log();
  console.log("dolar is here" + props.Usd);
  console.log(info);
  return (
    <>
      {info && (
        <div className="container">
          <div className=" mt-4">
            <h2> Some Text About Us</h2>
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem
            accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
            quae ab illo inventore veritatis et quasi architecto beatae vitae
            dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit
            aspernatur aut odit aut fugit, sed quia consequuntur magni dolores
            eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est,
            qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit,
            sed quia non numquam eius modi tempora incidunt ut labore et dolore
            magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis
            nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut
            aliquid ex ea commodi consequatur? Quis autem vel eum iure
            reprehenderit qui in ea voluptate velit esse quam nihil molestiae
            consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla
            pariatur?"
          </div>

          <b>
            <div className="my-2">
              <b>Contract Owner : </b> {info.owner}
            </div>
            <div className="row">
              <div>
                Total Funds Collected ={" "}
                {EthToUSD(info.totalFundCollection, props.Usd)}
              </div>
              <div>
                Current Balance = {EthToUSD(info.currentBalance, props.Usd)}
              </div>
              <div>Total Projects = {info.totalProjects}</div>
              <div>Total Target Achived = {info.targetAchives}</div>
              <div>Total Donators = {info.totalDonations}</div>
              <div>
                Total WithDraw Amount =
                {EthToUSD(info.totalWithdrawamount, props.Usd)}
              </div>
              <div>
                Total Refunds Amount = {EthToUSD(info.totalRefund, props.Usd)}
              </div>
              <div>
                Total Fee Collected =
                {EthToUSD(info.totalFeeCollected, props.Usd)}
              </div>
            </div>
          </b>
        </div>
      )}
    </>
  );
}
