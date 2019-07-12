import React from 'react';
import './index.less';
const Tag = ({title,color,...restProps }) => {
    return (

            <div className="tag" style={{
                background:`rgba(${parseInt(restProps.r)},${parseInt(restProps.g)},${parseInt(restProps.b)},0.1)`,
                borderColor:`rgba(${parseInt(restProps.r)},${parseInt(restProps.g)},${parseInt(restProps.b)},0.4)`,
                color:`rgb(${parseInt(restProps.r)},${parseInt(restProps.g)},${parseInt(restProps.b)})`}}
                >
                {title}
            </div>

    );
};

export default Tag;