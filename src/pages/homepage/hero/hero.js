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
                      <p> Gopher Mines Club - Beta Test </p>
                      <p>Proof of Concept </p>
                      <p>Built on<img src="https://nft-images-ghog.s3.us-west-1.amazonaws.com/Polygon.gif" width="20%" height="20%" align="middle" />
                      </p>
                      <div className={styles.buttonGrid}>
                          <Button
                              data={{ name: "Mint", action: "mint", style: "trans" }}
                          />
                          <Button
                              data={{ name: "Stake", action: "stake", style: "trans" }}
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
