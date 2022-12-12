import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CountdownTimer from "../../countdownTimer/countdownTimer";
import Loader from "../../loader/loader";

import styles from "./stakedRow.module.css";
import { handleUnStake } from "../../stakeCard/stakeHelpers";
import AppPagination from "../../pagination/pagination";

const StakedRow = ({ data }) => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  const { connected } = useSelector(
    (state) => state.connection.connectionState
  );

  const authState = useSelector((state) => state.auth);

  const [userData, setUserData] = useState([]);

  return (
    <>
      <div className={styles.userContainer}>
        <>
          <div className={styles.stakedHeader}>
            <p>Stake date</p>
            <p>Token</p>
            <p>ID</p>
            {/* <p>Next Payment in</p> */}
            <p>Unlock Date</p>
            <p>Action</p>
          </div>
          <hr />
        </>
        {userData.map((item) => {
          const disabled = item.unlock > new Date().getTime();
          const d = new Date(item.date);
          const date = `${
            months[d.getMonth()]
          } ${d.getDate()}, ${d.getFullYear()}`;
          return (
            <div key={item._id}>
              <div className={styles.stakedRow}>
                <span>{date}</span>
                <span>{item.nftName}</span>
                <span>{item.tokenId}</span>
                {/* <CountdownTimer time={item.next} payment={true} /> */}
                <CountdownTimer time={item.unlock} payment={false} />
                <button
                  onClick={() =>
                    handleUnStake(
                      setLoading,
                      item.stakeId,
                      authState.loggedIn,
                      dispatch
                    )
                  }
                  disabled={disabled || loading}
                >
                  {loading ? (
                    <Loader />
                  ) : !connected ? (
                    "Connect Wallet"
                  ) : (
                    "Unstake"
                  )}
                </button>
              </div>
              <hr />
            </div>
          );
        })}
      </div>
      <div className={styles.paginationContainer}>
        <AppPagination callback={setUserData} rawData={data} />
      </div>
    </>
  );
};

export default StakedRow;
