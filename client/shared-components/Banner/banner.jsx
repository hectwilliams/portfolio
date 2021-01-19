import React from 'react';
import BannerCss from './banner.css';

const tmp = 40;
const myName = "Hector Williams";

const Banner = ({ name }) => (
  <div>
    <div className={BannerCss.container}>
      <span title={name}> {`${name}`}⚡ </span>
    </div>

    <footer>
      <p>© 2020 Hector Williams  </p>
    </footer>

  </div>
)
export default Banner;