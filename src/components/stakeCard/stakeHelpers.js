import { ethers, BigNumber } from "ethers";

import { config } from "../../config";
import { notificationActions } from "../../store/notification/notification";
import { apiRequest } from "../../helpers/connections";

const { nftContract, stakeContract, nftABI, stakeABI, USDCContract, ERC20ABI } =
  config;

export const handleStake = async (
  dispatch,
  availableHog,
  setLoading,
  address,
  auth
) => {
  if (Number(availableHog.length) < 1) {
  } else {
    if (window.ethereum) {
      setLoading(true);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(stakeContract, stakeABI, signer);
      const NFTcontract = new ethers.Contract(nftContract, nftABI, signer);

      try {
        //debugger;
        //get id of the nft
        const nftResponse = await NFTcontract.tokenIdToNFTId(availableHog[0]);
        //get stake duration
        const stakeDuration = await contract.nftIdToDUration(nftResponse);
        //get NFTName
        const nftName = await NFTcontract.tokenIdToNFTName(availableHog[0]);

        //calculate duration from now
        const today = new Date();
        const date = new Date();

        const stakedurStamp = new Date(
          date.setMonth(
            today.getMonth() +
              BigNumber.from(`${stakeDuration._hex}`).toNumber()
          )
        );

        const response = await contract.stake(
          nftContract,
          availableHog[0],
          stakedurStamp.getTime()
        );

        const receipt = await response.wait();

        const stakeId = receipt.logs[3].topics[3];

        const data = await apiRequest(
          "stake",
          { address, stakeId, nftName },
          "post",
          auth
        );

        if (data.status === 200) {
          // update the front end bal before the blockchain data returns
          dispatch(notificationActions.setContractAction());
          dispatch(notificationActions.setMessage("Stake Successful"));
          setLoading(false);
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);

        dispatch(notificationActions.setMessage(error.message));
      }
    }
  }
};

export const handleGroundHogBalance = async (address, setAvailableHog) => {
  if (window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(nftContract, nftABI, signer);

    try {
      const balance = await contract.Owned(address);

      setAvailableHog(await balance);
    } catch (error) {
      console.log("error", error);
    }
  }
};

export const handleGroundHogStakedBalance = async (address, setStakedHog) => {
  if (window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(stakeContract, stakeABI, signer);

    try {
      const balance = await contract.stakeIds(address);

      setStakedHog(await balance);
    } catch (error) {
      console.log("error", error);
    }
  }
};

export const checkApproved = async (address, setApproved, setNotReady) => {
  if (window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(nftContract, nftABI, signer);

    try {
      //debugger;
      console.log(address, stakeContract);
      const response = await contract.isApprovedForAll(address, stakeContract);
      response ? setApproved(true) : setApproved(false);
      setNotReady(false);
    } catch (error) {
      console.log("error", error);
    }
  }
};

export const handleUSDCbalance = async (address, setUSDCBalance) => {
  if (window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(USDCContract, ERC20ABI, signer);

    try {
      //debugger;
      const response = await contract.balanceOf(address);
      const balance = BigNumber.from(`${response._hex}`).toString();
      setUSDCBalance(balance / 10 ** 18);
    } catch (error) {
      console.log("error", error);
    }
  }
};

export const handleUnStake = async (setLoading, id, auth, dispatch) => {
  if (window.ethereum) {
    setLoading(true);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(stakeContract, stakeABI, signer);

    try {
      //debugger;
      const response = await contract.unstake(id);

      await response.wait();

      //update stake

      const data = await apiRequest(
        "stake/unstake",
        { stakeId: id },
        "post",
        auth
      );

      if (data.status === 200) {
        dispatch(notificationActions.setContractAction());

        dispatch(notificationActions.setMessage("UnStake Successful"));
        setLoading(false);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);

      dispatch(notificationActions.setMessage(error.message));
    }
  }
};

export const userData = async (auth, setUser) => {
  const data = await apiRequest("user", undefined, undefined, auth);
  setUser(data);
};

export const handleStakingApproval = async (
  dispatch,
  setLoading,
  setApproved
) => {
  if (window.ethereum) {
    setLoading(true);

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(nftContract, nftABI, signer);

    try {
      //debugger;
      const response = await contract.setApprovalForAll(stakeContract, true);
      await response.wait();

      setApproved(true);

      setLoading(false);
      dispatch(notificationActions.setMessage("Approval Completed"));
    } catch (error) {
      setLoading(false);
      dispatch(notificationActions.setMessage(error.message));
    }
  }
};
