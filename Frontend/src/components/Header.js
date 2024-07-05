import React, { useState, useEffect } from 'react'
import Logo from "../logo/spaghetti-svgrepo-com.svg";
import Eth from "../logo/eth.svg";
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Select } from 'antd';
// import { client } from "../../../Backend/database";


function Header(props) {
  const { address, isConnected, connect } = props;
  const { t, i18n } = useTranslation();

  const [lang, setLang] = useState("en");

  useEffect(() => {
    let l = localStorage.getItem("lang");
    if (l) {
      handleChange(l);
    } else {
      handleChange("en");
    }
  }, []);


  const handleChange = (value) => {
    i18n.changeLanguage(value, (err, _) => {
      if (err) return console.log('something went wrong loading', err);
    }).then(() => {
      setLang(value);
    });
  }

  // const saveUserHash = async (userAddress) => {

  //     await address.setUserHash(userAddress);
  //     const userHash = await address.getUserHash(userAddress);

  //     await client.create({
  //       _type: 'userHash',
  //       address: userAddress,
  //       hash: userHash,
  //     });

  //     console.log(saveUserHash,'User hash saved successfully');
  //   }
  const getUserHash = async (userAddress) => {
    try {
      const userHash = await address.setUserHash(userAddress);
      console.log('User hash:', userHash);
    } catch (error) {
      console.error('Error getting user hash:', error);
    }
  }

  return (
    <header>
      <div className='leftH'>
        <img src={Logo} alt='logo' className='logo' />
        <Link to="/" className="link">
          <div className='headerItem'>{t('SWAP')}</div>
        </Link>
        <Link to="/Token" className="link">
          <div className='headerItem'>TOKEN</div>
        </Link>
        <Link to="/Pool" className="link">
          <div className='headerItem'>{t('POOL')}</div>
        </Link>

      </div>

      <div className='rightH'>
        <div className='headerItem'>
          <img src={Eth} alt='eth' className='eth' />
          ethereum
        </div>
        <div className='connectButton' onClick={connect}>
          {isConnected ? (address.slice(0, 4) + "..." + address.slice(38)) : t("Connect Wallet")}
        </div>
        <Select
          value={lang}
          style={{
            width: 120,
          }}
          onChange={handleChange}
          options={[
            {
              value: 'en',
              label: 'English',
            },
            {
              value: 'vi',
              label: 'Tiếng Việt',
            }
          ]}
        />

      </div>
    </header>
  )
}

export default Header