import React from 'react';
import './index.less'
const Tag = ({title,color,...restProps }) => {
    return (

            <div className="tag" style={{background:color}} {...restProps}>
                {title}
            </div>

    );
};

export default Tag;