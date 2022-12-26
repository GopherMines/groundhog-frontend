import React, { useEffect, useState } from "react";

import styles from "./mint.module.css";
import ConnectButton from "../../components/connectButton/connectButton";
import Card from "../../components/card/card";
import Header from "../../components/header/header";
import SectionWidth from "../../components/sectionWidth/sectionWidth";
import MintCard from "../../components/mintCard/mintCard";
import Footer from "../../components/footer/footer";
import { apiRequest } from "../../helpers/connections";

const Mint = () => {
  const [NFTs, setNFTs] = useState([]);

  const getNFTs = async () => {
    const result = await apiRequest("collection");
    setNFTs(result);
  };

  useEffect(() => {
    getNFTs();
  }, []);

  return (
    <>
      <Card>
        <Header />
      </Card>
      <ConnectButton />
      <SectionWidth>
        <section className={styles.mintSection}>
          <h3>MINT</h3>
          <p>Make Sure You Are Using Polygon Chain</p>
          <Card>
            <div className={styles.MintGrid}>
              {NFTs.map((nft) => {
                return <MintCard key={nft._id} data={nft} />;
              })}
            </div>
          </Card>
        </section>
      </SectionWidth>
      <Footer />
    </>
  );
};

export default Mint;
