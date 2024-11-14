import React, {FunctionComponent} from 'react';
import './index.scss';

const Loading: FunctionComponent = () => {

    const [style, setStyle] = React.useState({opacity: 0});
    React.useEffect(() => {
        setStyle({opacity: 1});
    }, []);
    return (
        <div className={'para-loading'} style={style}>
            <div className="para-loading-icon">
                <div className={'para-loading-item'}></div>
                <div className={'para-loading-item'}></div>
                <div className={'para-loading-item'}></div>
                <div className={'para-loading-item'}></div>
                <div className="para-loading-msg"></div>
            </div>
        </div>
    )
}

export default Loading;
