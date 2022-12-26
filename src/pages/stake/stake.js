import React from "react";

import Card from "../../components/card/card";
import ConnectButton from "../../components/connectButton/connectButton";
import Header from "../../components/header/header";
import SectionWidth from "../../components/sectionWidth/sectionWidth";
import Footer from "../../components/footer/footer";
import styles from "./stake.module.css";
import StakeCard from "../../components/stakeCard/stakeCard";
import StakedTable from "../../components/StakedTable/StakedTable";
import ReturnNFT from "../../components/returnNFT/returnNFT";

const Stake = () => {
  return (
    <>
      <Card>
        <Header />
      </Card>
      <ConnectButton />
      <SectionWidth>
        <section className={styles.stakeSection}>
          <h3>STAKE</h3>
          <p>Make Sure You Are Using Polygon Chain</p>
          <Card>
            <div className={styles.stakeGrid}>
              <StakeCard />
              <img src={require("../../assets/mine.png")} alt="mine" />
            </div>
          </Card>
        </section>

        <section className={styles.stakeSection}>
          <h3>STAKED</h3>

          <Card>
            <StakedTable />
          </Card>
        </section>

        <section className={styles.stakeSection}>
          <h3>Return NFT</h3>

          <Card>
            <ReturnNFT />
          </Card>
        </section>
      </SectionWidth>
      <Footer />
    </>
  );
};

export default Stake;
