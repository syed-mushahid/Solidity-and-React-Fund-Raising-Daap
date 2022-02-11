// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;
contract Crowdfunding{

    constructor() {
     contractInfo.owner=payable(msg.sender);
    }

    struct Projects {
        uint projectID;
        string projectTitle;
        string projectDesc;
        address payable projectOwner;
        string category;
        uint target;
        uint currentBalance;
        uint contributorsNum;
        uint deadline;
        uint compaignStatus;
        bool emergency;
        string thumbnail;
}



struct DoantionsDetails{
uint donationAmount;
string projectTitle;
uint projectDeadline;
uint projectId;
uint donationTime;
uint donationStatus;
}

struct ContractInfo{
uint totalFundCollection;
uint currentBalance;
uint totalProjects;
uint targetAchives;
uint totalDonations;
uint totalWithdrawamount;
uint totalRefund;
uint totalFeeCollected;
address payable owner;
}

ContractInfo contractInfo;
Projects[] project;
mapping(address=>DoantionsDetails[]) myDonations;
mapping(address=>uint) donationNo;
uint totalCommission;
function CreateProject( string memory _projectTitle,string memory _projectDesc,string memory _category,uint _target,uint _deadline,bool _emergency,string memory _thumbnail) public {

    project.push();
    project[contractInfo.totalProjects].projectID=contractInfo.totalProjects;
    project[contractInfo.totalProjects].projectTitle=_projectTitle;
    project[contractInfo.totalProjects].projectDesc=_projectDesc;
    project[contractInfo.totalProjects].category=_category;
    project[contractInfo.totalProjects].target=_target;
    project[contractInfo.totalProjects].deadline=_deadline;
    project[contractInfo.totalProjects].projectOwner=payable(msg.sender);
    project[contractInfo.totalProjects].emergency=_emergency;
    project[contractInfo.totalProjects].thumbnail=_thumbnail;
    contractInfo.totalProjects++;
    

}



function donateFund(uint _projectId) public payable{
  
  require(project[_projectId].compaignStatus==0 ,"Compaign Has Been Closed");
    project[_projectId].currentBalance=project[_projectId].currentBalance+msg.value;  
    project[_projectId].contributorsNum++;
    myDonations[msg.sender].push();
    myDonations[msg.sender][donationNo[msg.sender]].donationAmount=msg.value;
    myDonations[msg.sender][donationNo[msg.sender]].projectId=_projectId;
    myDonations[msg.sender][donationNo[msg.sender]].projectTitle=project[_projectId].projectTitle;
    myDonations[msg.sender][donationNo[msg.sender]].projectDeadline=project[_projectId].deadline;
    myDonations[msg.sender][donationNo[msg.sender]].donationTime=block.timestamp;
    donationNo[msg.sender]++;

    contractInfo.totalFundCollection=contractInfo.totalFundCollection+msg.value;
    contractInfo.currentBalance=address(this).balance;
    contractInfo.totalDonations++;
    if(project[_projectId].currentBalance>=project[_projectId].target){
    project[_projectId].compaignStatus=1;
    contractInfo.targetAchives++;
    }
   else if(project[_projectId].deadline<=block.timestamp){
    project[_projectId].compaignStatus=2;
    }
   

}


function withDrawFunds(uint _projectId) public payable{

    require(msg.sender==project[_projectId].projectOwner,"You Are Not Owner Of this Project");
    require(project[_projectId].compaignStatus!=3,"Funds Are Already Collected");
    require(block.timestamp>=project[_projectId].deadline,"DeadLine Didnot Matched");
    uint fee;
    if(project[_projectId].emergency==true)
    {
     fee=(project[_projectId].currentBalance/1000)*40;
    }
    else{
           fee=(project[_projectId].currentBalance/1000)*15;
  
    }
    uint finalAmount=project[_projectId].currentBalance-fee;
    project[_projectId].projectOwner.transfer(finalAmount);
    contractInfo.owner.transfer(fee);
    totalCommission=totalCommission+fee;
    project[_projectId].compaignStatus=3;
    contractInfo.currentBalance=address(this).balance;
    contractInfo.totalWithdrawamount= contractInfo.totalWithdrawamount+finalAmount;
    contractInfo.totalFeeCollected=contractInfo.totalFeeCollected+fee;
    

}

function refund(uint _projectId, uint _refundId) public payable{
    require(donationNo[msg.sender]>0,"You Have No Contribution In This Compaign");
    require(block.timestamp<=project[_projectId].deadline,"This Compaign has been closed now you cant refund it");
    payable(msg.sender).transfer(myDonations[msg.sender][_refundId].donationAmount);
    project[_projectId].currentBalance= project[_projectId].currentBalance-myDonations[msg.sender][_refundId].donationAmount;
    myDonations[msg.sender][_refundId].donationStatus=1;
    project[_projectId].contributorsNum--;
    contractInfo.currentBalance=address(this).balance;
    contractInfo.totalRefund=contractInfo.totalRefund+myDonations[msg.sender][_refundId].donationAmount;
      if(project[_projectId].currentBalance<project[_projectId].target){
    project[_projectId].compaignStatus=0;
    
    }
}

// function getContractBalance() public view returns(uint){

// return address(this).balance;
// }


// function getProjectBalance(uint _projectId) public view returns(uint){

//     return project[_projectId].currentBalance;
// }




function getContractInfo() public view returns(ContractInfo memory )
{
    return contractInfo;
}


function getSingleProject(uint _projectId) public view returns(Projects memory){


        return project[_projectId];
}

function getProjects() public view returns(Projects[] memory){

return project;

} 

 function getDonationData(address user) public view returns(DoantionsDetails[] memory)
 {

return myDonations[user];
}


// function ChangeContractOwner(address _newOwner) public {

// require(msg.sender==owner," Only owners Are Allowed To Perform This Actions");
// owner=payable (_newOwner);
// }
// function ChangeProjectOwner(address _newOwner,uint _projectId) public {

// require(msg.sender==project[
//     _projectId].projectOwner," Only Project owners Are Allowed To Perform This Actions");
// project[_projectId].projectOwner=payable (_newOwner);
// }

function getTotalCommission() public view returns(uint) {

    return totalCommission;
}
}
