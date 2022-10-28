import { BigNumber, ethers } from "ethers";

import { config } from "../../../../config";
import { notificationActions } from "../../../../store/notification/notification";

const { nftContract, nftABI, ERC20ABI, USDCContract } = config;

export const handleMultisending = async (dispatch, data, setLoading) => {
  let details = [...data];
  if (Number(details.length) < 1) {
  } else {
    if (window.ethereum) {
      setLoading(true);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(nftContract, nftABI, signer);

      try {
        //debugger;

        while (details.length > 50 || details.length > 0) {
          const currentDetails = details.slice(0, 50);
          const arrayNest = await new Promise((resolve, reject) => {
            let receiverArr = [];
            let amountArr = [];

            currentDetails.forEach((item, index) => {
              const itemArr = item.split(":");
              receiverArr.push(itemArr[0].trim());
              amountArr.push(String(Number(itemArr[1].trim()) * 10 ** 6));

              if (
                receiverArr.length === index + 1 &&
                amountArr.length === index + 1
              ) {
                resolve([receiverArr, amountArr]);
              }
            });
          });

          const response = await contract.multisender(
            arrayNest[0],
            arrayNest[1],
            USDCContract
          );

          await response.wait();

          details = details.slice(50, undefined);
        }

        dispatch(notificationActions.setMessage("Send Successful"));
        setLoading(false);
      } catch (error) {
        setLoading(false);

        dispatch(notificationActions.setMessage(error.message));
      }
    }
  }
};

export const checkApproved = async (address, setApproved) => {
  if (window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(USDCContract, ERC20ABI, signer);

    try {
      //debugger;
      const response = await contract.allowance(address, nftContract);
      const allowance = BigNumber.from(`${response._hex}`).toString();
      allowance >= 100000000 * 10 ** 6 ? setApproved(true) : setApproved(false);
    } catch (error) {
      console.log("error", error);
    }
  }
};

export const handleMultisendingApproval = async (
  dispatch,
  setLoading,
  setApproved
) => {
  if (window.ethereum) {
    setLoading(true);

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(USDCContract, ERC20ABI, signer);

    try {
      //debugger;
      const response = await contract.approve(
        nftContract,
        "100000000000000000000000000"
      );
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
