import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ethers, BigNumber } from "ethers";

import styles from "./mintCard.module.css";
import Loader from "../loader/loader";
import { notificationActions } from "../../store/notification/notification";
import { config } from "../../config";

const MintCard = ({ data }) => {
  const {
    nftContract: mintContract,
    nftABI: abi,
    USDCContract,
    ERC20ABI,
  } = config;

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [approve, setApprove] = useState(false);
  const [notReady, setNotReady] = useState(true);

  const { connected, address } = useSelector(
    (state) => state.connection.connectionState
  );

  const checkApproved = async () => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(USDCContract, ERC20ABI, signer);

      try {
        //debugger;
        const response = await contract.allowance(address, mintContract);
        const allowance = BigNumber.from(`${response._hex}`).toString();
        allowance >= 100000 * 10 ** 6 ? setApprove(true) : setApprove(false);
        setNotReady(false);
      } catch (error) {
        console.log("error", error);
      }
    }
  };

  const handleApproval = async () => {
    if (window.ethereum) {
      setLoading(true);

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(USDCContract, ERC20ABI, signer);

      try {
        //debugger;
        const response = await contract.approve(
          mintContract,
          "1000000000000000"
        );
        await response.wait();

        setApprove(true);

        setLoading(false);
        dispatch(notificationActions.setMessage("Approval Completed"));
      } catch (error) {
        setLoading(false);
        dispatch(notificationActions.setMessage(error.message));
      }
    }
  };

  const HandleMint = async () => {
    if (window.ethereum) {
      setLoading(true);

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(mintContract, abi, signer);

      try {
        const response = await contract.mintNFT(USDCContract, data._id);
        await response.wait();

        //send address to api to confirm, set timeout
        dispatch(notificationActions.setMessage("NFT Minted Succesfully"));

        setLoading(false);
      } catch (error) {
        setLoading(false);
        dispatch(notificationActions.setMessage(error.message));
      }
    }
  };

  checkApproved();

  return (
    <div className={styles.mintCard}>
      <img src={data.image} alt={data.name} />
      <hr />
      <div>
        <div>
          <p>Name:</p>
          <span>{data.nftName}</span>
        </div>
        <div>
          <p>Cost:</p>
          <span>{data.cost} USDC</span>
        </div>
        <div>
          <p>Stake:</p>
          <span>{data.duration} Months</span>
        </div>
        <div>
          <p>APR:</p>
          <span>{data.percentage * 12}%</span>
        </div>
        <button
          onClick={() => {
            approve ? HandleMint() : handleApproval();
          }}
          disabled={notReady || loading}
        >
          {loading ? (
            <Loader />
          ) : !connected ? (
            "Connect Wallet"
          ) : approve ? (
            "Mint"
          ) : (
            "Approve"
          )}
        </button>
      </div>
    </div>
  );
};

export default MintCard;
