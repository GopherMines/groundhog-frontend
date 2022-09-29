import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import styles from "./stakeCard.module.css";
import Card from "../card/card";
import AccountDetailsGrid from "./accountDetailsGrid/accountDetailsGrid";
import { notificationActions } from "../../store/notification/notification";
import Loader from "../loader/loader";

import {
  handleStake,
  handleGroundHogBalance,
  handleStakingApproval,
  handleGroundHogStakedBalance,
  checkApproved,
  handleUSDCbalance,
  userData,
} from "./stakeHelpers";

const StakeCard = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const { message, constractAction } = useSelector(
    (state) => state.notification
  );

  const authState = useSelector((state) => state.auth);

  const [approved, setApproved] = useState(false);
  const [availableHog, setAvailableHog] = useState(0);
  const [stakedHog, setStakedHog] = useState(0);
  const [USDCBalance, setUSDCBalance] = useState(0);
  const [user, setUser] = useState({});

  const { connected, address } = useSelector(
    (state) => state.connection.connectionState
  );
  const accountData = [
    { name: "GoundHog Balance", value: availableHog.length },
    { name: "USDC Balance", value: USDCBalance },
    { name: "Total Staked", value: stakedHog.length },
    { name: "Pending USDC ", value: user.totalPaid || 0 },
    { name: "Total USDC Claimed", value: user.pendingPaid || 0 },
  ];

  useEffect(() => {
    checkApproved(address, setApproved);
    handleGroundHogBalance(address, setAvailableHog);
    handleGroundHogStakedBalance(address, setStakedHog);
    handleUSDCbalance(address, setUSDCBalance);
    userData(authState.loggedIn, setUser);
  }, [constractAction, address, authState.loggedIn]);

  useEffect(() => {
    dispatch(notificationActions.setPushMessage(message));

    const timeout = setTimeout(() => {
      dispatch(notificationActions.setMessage(""));
    }, 4500);

    return () => {
      clearTimeout(timeout);
    };
  }, [message, dispatch]);

  return (
    <div className={styles.stakeCard}>
      <Card>
        <div className={styles.cardContainer}>
          {accountData.map((item) => {
            return <AccountDetailsGrid key={item.name} data={item} />;
          })}
        </div>
      </Card>
      <button
        disabled={loading}
        onClick={
          !approved
            ? () => {
                handleStakingApproval(dispatch, setLoading, setApproved);
              }
            : () => {
                handleStake(
                  dispatch,
                  availableHog,
                  setLoading,
                  address,
                  authState.loggedIn
                );
              }
        }
      >
        {loading ? (
          <Loader />
        ) : !connected ? (
          "Connect Wallet"
        ) : approved ? (
          "Stake"
        ) : (
          "Approve"
        )}
      </button>
      <p>One NFT is staked per transaction</p>
    </div>
  );
};

export default StakeCard;
