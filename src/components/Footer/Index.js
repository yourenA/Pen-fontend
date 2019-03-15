import React from 'react';
import './index.less'
const Footer = ({maxWidth }) => {
    return (

            <div className="footer" >
                <div className="footer-content" style={{maxWidth:maxWidth?maxWidth+'px':'1100px'}}>
                    <p>Project build with React & NodeJS</p>
                    <p>@2019 ♥ Daijiaru</p>
                </div>

            </div>

    );
};

export default Footer;