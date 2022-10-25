import React from "react";
import Button from "../../../components/button/button";
import SectionWidth from "../../../components/sectionWidth/sectionWidth";

import styles from "./hero.module.css";
const Hero = () => {
  return (
    <section>
      <SectionWidth>
        <div className={styles.heroGrid}>
          <div className={styles.heroTexts}>
            <h1>Gopher Mines</h1>
            <p>
                          Gopher Mines Club - Beta Test
                          Proof of Concept
            </p>
            <div className={styles.detailGrid}>
              <p>Mint Gopher NFTs</p>
              <lottie-player
                src="https://lottie.host/4e515e4c-34f6-4fa4-9d1f-ef6539c0f86d/kC76FKZ4Ls.json"
                background="transparent"
                speed="1"
                loop
                style={{ width: "60px", height: "45px" }}
                autoplay
              ></lottie-player>
            </div>
            <div className={styles.detailGrid}>
              <p>6% staking APY</p>
              <lottie-player
                src="https://lottie.host/4e515e4c-34f6-4fa4-9d1f-ef6539c0f86d/kC76FKZ4Ls.json"
                background="transparent"
                speed="1"
                loop
                style={{ width: "60px", height: "45px" }}
                autoplay
              ></lottie-player>
            </div>
            <div className={styles.buttonGrid}>
              <Button
                data={{ name: "Mint Now", action: "mint", style: "trans" }}
              />
              <Button
                data={{ name: "Stake 6%", action: "stake", style: "trans" }}
              />
            </div>
          </div>
          <div className={styles.heroImage}></div>
          <div></div>
        </div>
      </SectionWidth>
    </section>
  );
};

export default Hero;
