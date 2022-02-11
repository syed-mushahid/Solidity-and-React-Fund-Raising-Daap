import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Fade from "react-reveal/Fade";

export default function ProjectCard(props) {
  const [status, setstatus] = useState();
  const [DonateButton, setDonateButton] = useState({ display: "none" });
  let collectedPercentage;
  useEffect(() => {
    if (props.status == 0) {
      setstatus("Active");
    } else if (props.status == 1) {
      setstatus("Target Achived");
    } else if (props.status == 2) {
      setstatus("Expired");
    }
  });
  collectedPercentage = (props.collected / props.target) * 100;

  const unixTime = props.deadline;
  const date = new Date(unixTime * 1000);
  let months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "June",
    "July",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  let monthName = months[date.getMonth()];
  let day = date.getDate();
  let year = date.getFullYear();
  return (
    <>
      <Fade bottom big>
        <div className="col-md-6 col-lg-4">
          <div className="card  mb-2">
            <div className="deadlineCard">
              <p>
                {day + " " + monthName}
                <br></br> {year}
              </p>
            </div>
            <div
              onMouseEnter={(e) => {
                setDonateButton({ display: "flex" });
              }}
              onMouseLeave={(e) => {
                setDonateButton({ display: "none" });
              }}
              className="col-12 projectThumbnail"
            >
              <a href="#">
                <div style={DonateButton} className="donate-button col-12">
                  {props.status == 0 ? (
                    <button
                      className="donateNow"
                      data-bs-toggle="modal"
                      data-bs-target="#DonateModal"
                      data-projectId={props.projectId}
                      data-projectTitle={props.projectTitle}
                    >
                      Donate Now
                    </button>
                  ) : (
                    " "
                  )}
                </div>
              </a>
              <img
                className={` ${
                  DonateButton.display != "flex" ? "" : "zoom-thumbnail"
                }`}
                src={props.thumbnail}
                alt="thumbnail"
              />
            </div>
            <div className="p-3">
              <div className="d-flex justify-content-between">
                <div className="d-flex flex-row align-items-center">
                  <div className="ms-2 c-details">
                    <h6 className="mb-0">Created By: </h6>
                    <p
                      style={{
                        overflowWrap: "break-word",
                        width: "200px",
                        fontSize: "12px",
                      }}
                    >
                      {props.creator}
                    </p>
                  </div>
                </div>
                <div className="badge">
                  <br />
                  <span>{props.category}</span>
                  <br />
                  {props.emergency == true ? (
                    <span id="emergencyBadge">Emergency</span>
                  ) : (
                    ""
                  )}
                </div>
              </div>

              <div className="mt-1">
                <Link to={"project/" + props.projectId}>
                  <h3 className="heading">{props.projectTitle}</h3>
                </Link>
                <div className="mt-3">
                  <div className="col-12 d-flex">
                    <h6 style={{ marginRight: "auto" }}>Status: {status}</h6>
                    <h6 style={{ marginLeft: "auto" }}>
                      Target: {props.target}$
                    </h6>
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
                      {props.collected} $ Contributed
                      <span className="text2">
                        &nbsp; By {props.contributorsNum} Donations
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Fade>
    </>
  );
}
