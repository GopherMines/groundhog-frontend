import React, { useState, useEffect } from "react";
import AppPagination from "../../../../components/pagination/pagination";

import { notificationActions } from "../../../../store/notification/notification";

import styles from "./users.module.css";
import { apiRequest } from "../../../../helpers/connections";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";

const Users = () => {
  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const { constractAction } = useSelector((state) => state.notification);

  const [fetchedData, setFetchedData] = useState([]);

  const deleteUser = async (id) => {
    const data = await apiRequest(
      "user/" + id,
      undefined,
      "delete",
      authState.loggedIn
    );
    if (data.status === 200) {
      dispatch(notificationActions.setContractAction());

      dispatch(notificationActions.setMessage("Delete Successful"));
    } else {
      dispatch(notificationActions.setMessage("An error occured"));
    }
  };

  const handlePullCSV = async (e) => {
    const response = await axios({
      method: "get",
      url: "https://api.gophermines.com/user/allusers",
      headers: {
        Authorization: `Bearer ${authState.loggedIn.token}`,
      },
      responseType: "blob",
    });

    const blob = response.data;

    // 2. Create blob link to download
    const url = window.URL.createObjectURL(new Blob([blob]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `payments.csv`);
    // 3. Append to html page
    document.body.appendChild(link);
    // 4. Force download
    link.click();
    // 5. Clean up and remove the link
    link.parentNode.removeChild(link);
  };

  const handleStakeCSV = async (e) => {
    const response = await axios({
      method: "get",
      url: "https://api.gophermines.com/stake/stakecsv",
      headers: {
        Authorization: `Bearer ${authState.loggedIn.token}`,
      },
      responseType: "blob",
    });

    const blob = response.data;

    // 2. Create blob link to download
    const url = window.URL.createObjectURL(new Blob([blob]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `stake.csv`);
    // 3. Append to html page
    document.body.appendChild(link);
    // 4. Force download
    link.click();
    // 5. Clean up and remove the link
    link.parentNode.removeChild(link);
  };

  useEffect(() => {
    const getData = async () => {
      const data = await apiRequest(
        "user/users",
        undefined,
        undefined,
        authState.loggedIn
      );
      setFetchedData(data);
    };
    getData();
  }, [authState.loggedIn, constractAction]);
  const [userData, setUserData] = useState([]);
  return (
    <>
      <div className={styles.userContainer}>
        <div>
          <div className={styles.Header}>
            <p>Address</p>
            <p>Name</p>
            <p>Email</p>
            <p>Home</p>
            <p>Phone</p>
            <p>Action</p>
          </div>
          <hr />
        </div>
        {userData &&
          userData.map((item) => {
            return (
              <div key={item._id}>
                {item.level === "user" && (
                  <>
                    <div className={styles.Row}>
                      <span>{item.address}</span>
                      <span>{item.fullname}</span>
                      <span>{item.email}</span>
                      <span>{item.haddress}</span>
                      <span>{item.phone}</span>
                      <img
                        onClick={() => deleteUser(item._id)}
                        src={require("../../../../assets/delete.png")}
                        alt="delete"
                      />
                    </div>
                    <hr />
                  </>
                )}
              </div>
            );
          })}
        <button onClick={handlePullCSV} className={styles.paymentsButton}>
          Get Users CSV
        </button>
        <button onClick={handleStakeCSV} className={styles.paymentsButton}>
          Get Staked CSV
        </button>
      </div>
      <div className={styles.paginationContainer}>
        <AppPagination callback={setUserData} rawData={fetchedData} />
      </div>
    </>
  );
};

export default Users;
