import React from 'react';
import ResponsiveEmbed from 'react-bootstrap/ResponsiveEmbed';
import Image from 'react-bootstrap/Image';

function Square(props) {
    return (
        // <div style={{ height: 'auto', maxWidth: '14.5vw', minHeight: '15vh', position: 'relative' }}>
        //     {props.spotIsStillValid ? <div onClick={props.guessHigher} className="higher-button"></div> : null}
        //     <ResponsiveEmbed aspectRatio="1by1">
        //         <Image style={{ objectFit: 'contain', ...(props.imgPath.includes('cardback') ? { borderRadius: '26%' } : {}) }} src={props.imgPath} alt="nothing loaded :(" ></Image>
        //     </ResponsiveEmbed>

        //     {props.spotIsStillValid ? <div onClick={props.guessLower} className="lower-button"></div> : null}
        // </div>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            {props.spotIsStillValid && <div onClick={props.guessHigher} className="higher-button"></div>}
            <Image style={{ maxWidth: '70%', ...(props.imgPath.includes('cardback') ? { borderRadius: '4%' } : {}) }} src={props.imgPath} alt="nothing loaded :(" ></Image>
            {props.spotIsStillValid && <div onClick={props.guessLower} className="lower-button"></div>}
        </div>
    );
}

export { Square };
