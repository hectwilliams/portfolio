import React from 'react';
import BannerCss  from './banner.css';

const tmp = 40;
const myName = "Hector Williams";

const Banner = () => (
  <div>
    <div className = {BannerCss.container}>
      <span className = {BannerCss.bannerName}> {'Portfolio' } ⚡  </span>
    </div>

    <footer>
        <p>© 2020 Hector Williams  </p>
    </footer>

  </div>
)
export default Banner;