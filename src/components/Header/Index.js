import React from 'react';
import './index.less'
const Header = ({ title, desc, background, ...restProps }) => {
    return (

            <div className="header">
                <div className="before" style={background?{background:`url(${background})`, backgroundAttachment: 'fixed',backgroundPosition:'center -50px'}:null}></div>
                <div className="header-content">
                    <h1>{title}</h1>
                    <h3>{desc}</h3>
                </div>
            </div>

    );
};

export default Header;