import React from 'react';
import GameLogo from './views/GameLogo'; // Tell webpack this JS file uses this image


function Logo() {
  // Import result is the URL of your image
  return <img src={GameLogo} alt="Logo" />;
}
export default Logo;