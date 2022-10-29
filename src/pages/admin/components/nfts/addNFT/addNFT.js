import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../../../../components/loader/loader";

import OverLay from "../../../../../components/overLay/overLay";
import { authSliceActions } from "../../../../../store/auth/auth";
import styles from "./addNFT.module.css";
import { handleSubmission as submissionHelper } from "./helpers";

const AddNFT = () => {
  const dispatch = useDispatch();
  const [addedNFT, setAddedNFT] = useState(false);
  const [updateNFT, setUpdateNFT] = useState(false);
  const [updateStaking, setUpdateStaking] = useState(false);
  const [loading, setLoading] = useState({
    addNFTLoading: false,
    updateNFTLoading: false,
    updateContractLoading: false,
  });

  const authState = useSelector((state) => state.auth);

  const handleBackdropCLick = () => {
    dispatch(authSliceActions.SetAdminPop(false));
  };

  const handleSubmission = (e) => {
    submissionHelper(
      e,
      addedNFT,
      updateNFT,
      setAddedNFT,
      setUpdateNFT,
      setLoading,
      authState.loggedIn,
      dispatch,
      updateStaking,
      setUpdateStaking
    );
  };

  return (
    <>
      <OverLay closeHandler={handleBackdropCLick} />
      <div className={styles.loginPop}>
        <i onClick={handleBackdropCLick} className="fa-solid fa-xmark"></i>
        <h2>Add NFT</h2>

        <form onSubmit={handleSubmission}>
          <label>
            NFT Name
            <input
              name="nftName"
              type="text"
              placeholder="Test Name"
              required
            />
          </label>
          <label>
            Image Url
            <input
              name="image"
              type="text"
              placeholder="https://mynftimage.jpg"
              required
            />
          </label>
          <label>
            JSON Url
            <input
              name="meta"
              type="text"
              placeholder="https://mynftmeta.json"
              required
            />
          </label>
          <label>
            Cost
            <input name="cost" type="tel" placeholder="Cost" required />
          </label>
          <label>
            Percentage
            <input name="percentage" type="tel" placeholder="7" required />
          </label>
          <label>
            Stake Duration (Months)
            <input name="duration" type="tel" placeholder="6" required />
          </label>

          <button
            disabled={loading.addNFTLoading || addedNFT}
            className={styles.formButton}
          >
            {loading.addNFTLoading ? <Loader /> : "Add NFT"}
          </button>
          <button
            disabled={loading.updateNFTLoading || !addedNFT || updateNFT}
            className={styles.formButton}
          >
            {loading.updateNFTLoading ? <Loader /> : "Update NFT Contract"}
          </button>
          <button
            disabled={
              loading.updateContractLoading ||
              !addedNFT ||
              !updateNFT ||
              updateStaking
            }
            className={styles.formButton}
          >
            {loading.updateContractLoading ? (
              <Loader />
            ) : (
              "Update Staking Contract"
            )}
          </button>
        </form>
      </div>
    </>
  );
};

export default AddNFT;
