import { apiRequest } from "../../../../../helpers/connections";
import {
  setLocalStorage,
  getFromLocalStorage,
} from "../../../../../helpers/utils";
import { notificationActions } from "../../../../../store/notification/notification";
import { ethers } from "ethers";
import { config } from "../../../../../config";

const {
  nftContract: mintContract,
  nftABI: abi,
  stakeContract,
  stakeABI,
} = config;

export const handleSubmission = async (
  e,
  addedNFT,
  updateNFT,
  setAddedNFT,
  setUpdateNFT,
  setLoading,
  auth,
  dispatch,
  updateStaking,
  setUpdateStaking
) => {
  e.preventDefault();
  const form = new FormData(e.target);
  if (!addedNFT) {
    setLoading((prevstate) => {
      let state = { ...prevstate };
      state.addNFTLoading = true;
      return state;
    });

    const body = {};
    for (const key of form.keys()) {
      if (key !== "meta") body[key] = form.get(key);
    }
    const data = await apiRequest("collection", body, "post", auth);

    if (data.status === 200) {
      setLocalStorage("nftId", data.id);
      setAddedNFT(true);
      dispatch(notificationActions.setMessage("NFT added to API"));
    } else {
      dispatch(
        notificationActions.setMessage("There was an error adding NFT to API")
      );
    }

    setLoading((prevstate) => {
      let state = { ...prevstate };
      state.addNFTLoading = false;
      return state;
    });
  } else if (addedNFT && !updateNFT) {
    const nftId = getFromLocalStorage("nftId");
    const fee = form.get("cost");
    const uri = form.get("meta");
    const percentage = form.get("percentage");
    const name = form.get("nftName");

    if (window.ethereum) {
      setLoading((prevstate) => {
        let state = { ...prevstate };
        state.updateNFTLoading = true;
        return state;
      });

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(mintContract, abi, signer);

      try {
        const response = await contract.addNFT(
          fee,
          nftId,
          uri,
          percentage,
          name
        );
        await response.wait();

        //send address to api to confirm, set timeout
        dispatch(
          notificationActions.setMessage("Added to NFT contract Successfully")
        );

        setUpdateNFT(true);

        setLoading((prevstate) => {
          let state = { ...prevstate };
          state.updateNFTLoading = false;
          return state;
        });
      } catch (error) {
        setLoading((prevstate) => {
          let state = { ...prevstate };
          state.updateNFTLoading = false;
          return state;
        });
        dispatch(notificationActions.setMessage(error.message));
      }
    }
  } else if (addedNFT && updateNFT && !updateStaking) {
    const nftId = getFromLocalStorage("nftId");
    const duration = form.get("duration");

    if (window.ethereum) {
      setLoading((prevstate) => {
        let state = { ...prevstate };
        state.updateContractLoading = true;
        return state;
      });

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(stakeContract, stakeABI, signer);

      try {
        const response = await contract.addNFT(nftId, duration);
        await response.wait();

        //send address to api to confirm, set timeout
        dispatch(
          notificationActions.setMessage(
            "Added to Staking Contract Successfully"
          )
        );

        setUpdateStaking(true);

        setLoading((prevstate) => {
          let state = { ...prevstate };
          state.updateContractLoading = false;
          return state;
        });
      } catch (error) {
        setLoading((prevstate) => {
          let state = { ...prevstate };
          state.updateContractLoading = false;
          return state;
        });
        dispatch(notificationActions.setMessage(error.message));
      }
      localStorage.removeItem("nftId");
    }
  }
};
