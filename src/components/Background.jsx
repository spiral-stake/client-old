import nft1 from "../assets/images/nft/nft-1.png";
import nft2 from "../assets/images/nft/nft-2.png";
import nft3 from "../assets/images/nft/nft-3.png";
import nft4 from "../assets/images/nft/nft-4.png";
import nft5 from "../assets/images/nft/nft-5.gif";
import token1 from "../assets/images/token/token1.png";
import token2 from "../assets/images/token/token2.png";
import token3 from "../assets/images/token/token3.png";
import token4 from "../assets/images/token/token4.png";
import token5 from "../assets/images/token/token5.png";
import token6 from "../assets/images/token/token6.png";
// import token7 from "../assets/images/token/token7.png";
import token8 from "../assets/images/token/token8.png";
import token9 from "../assets/images/token/token9.png";
import token10 from "../assets/images/token/token10.png";
import token11 from "../assets/images/token/token11.png";
import token12 from "../assets/images/token/token12.png";
import token13 from "../assets/images/token/token13.png";
import token14 from "../assets/images/token/token14.png";
import token15 from "../assets/images/token/token15.png";

import bg from "../styles/bg.module.css";

const nfts = [
  { src: nft1, alt: "NFT 1", className: "nft1" },
  { src: nft2, alt: "NFT 2", className: "nft2" },
  { src: nft3, alt: "NFT 3", className: "nft3" },
  { src: nft4, alt: "NFT 4", className: "nft4" },
  { src: nft5, alt: "NFT 5", className: "nft5" },
];

const tokens = [
  { src: token1, classNames: "token1 move" },
  { src: token2, classNames: "token2 zoom" },
  // { src: token3, classNames: "token3 rotate" },
  { src: token4, classNames: "token4 rotate" },
  { src: token5, classNames: "token5 zoom" },
  // { src: token6, classNames: "token6 rotate" },
  // { src: token7, classNames: "token7 zoom" },
  // { src: token8, classNames: "token8 zoom" },
  { src: token9, classNames: "token9 rotate" },
  { src: token10, classNames: "token10 rotate" },
  // { src: token11, classNames: "token11 rotate" },
  { src: token12, classNames: "token12 zoom" },
  { src: token13, classNames: "token13 move" },
  { src: token14, classNames: "token14 rotate" },
  { src: token15, classNames: "token15 move" },
];

const Background = ({ assetStandard }) => {
  return (
    <>
      <div className={assetStandard === "TOKEN" ? bg.blurToken : bg.blurNft}></div>
      {assetStandard === "TOKEN"
        ? tokens.map((token, index) => (
            <img
              key={index}
              className={`${bg.token} ${bg[token.classNames.split(" ")[0]]} ${
                bg[token.classNames.split(" ")[1]]
              }`}
              src={token.src}
              alt={token.alt}
            />
          ))
        : nfts.map((nft, index) => (
            <img
              key={index}
              className={`${bg.nft} ${bg[nft.className]}`}
              src={nft.src}
              alt={nft.alt}
            />
          ))}
      ;
    </>
  );
};

export default Background;
