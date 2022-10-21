import React from "react";
import { useSelector } from "react-redux";

import Header from "../../components/header/header";
import Hero from "./hero/hero";
import MintSection from "./mintSection/mintSection";
import StakingSection from "./stakingSection/stakingSection";
import Footer from "../../components/footer/footer";
import Login from "../../components/login/login";
import Signup from "../../components/signup/signup";
import Reset from "../../components/reset/reset";

const Hompage = () => {
  const authState = useSelector((state) => state.auth);
  return (
    <>
      <Header />
      <Hero />
      
      <Footer />
      {authState.loginPop && <Login />}
      {authState.signupPop && <Signup />}
      {authState.resetPop && <Reset />}
    </>
  );
};

export default Hompage;
