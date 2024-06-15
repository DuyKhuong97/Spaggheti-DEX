import React from 'react'
import Logo from "../logo/spaghetti-svgrepo-com.svg";
import Eth from "../logo/eth.svg";
import { Link } from 'react-router-dom';
function Header(props) {
  const {address, isConnected, connect} = props;
  return (
    <header>
      <div className='leftH'>
        <img src={Logo} alt='logo'  className='logo'/>
        <Link to="/" className="link">
          <div className='headerItem'>SWAP</div>
        </Link>
        <Link to="/Pool" className="link">
          <div className='headerItem'>POOL</div>
        </Link>
      
      </div>
    
      <div className='rightH'>
        <div className='headerItem'>
          <img src={Eth} alt='eth' className='eth'/>
          ethereum
        </div>
        <div className='connectButton' onClick={connect}>
          {isConnected ? (address.slice(0,4) + "..." + address.slice(38)) : "Connect"}
        </div>
      </div>
    </header>
  )
}

export default Header