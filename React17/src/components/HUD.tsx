import React from 'react';

import './HUD.scss';

interface Props{
  direction: number,
  onDirectionChange: (direction: number)=>void,
  animIndex: number,
  onAnimIndexChange: (animIndex: number)=>void,
  play: boolean,
  onPlayChange: (play: boolean)=>void
}

export const HUD = (props: Props)=>{
  const nextFrame = (n: number)=>{
    props.onAnimIndexChange((props.animIndex+n));
  }

  const togglePlay = ()=>{
    props.onPlayChange(!props.play);
  }

  const reverse = ()=>{
    props.onDirectionChange(-props.direction);
  }

  return (
    <div className="HUD">
          <div className="frame-counter">{props.animIndex}</div>
      <div className="input-bar">
        <input type="button" value="<<<" onClick={()=>nextFrame(-100)} />
        <input className="hide-xs" type="button" value="<<" onClick={()=>nextFrame(-10)} />
        <input type="button" value="<" onClick={()=>nextFrame(-1)} />
        <input className="important-button" type="button" value={props.play ? 'stop': 'play'} onClick={()=>togglePlay()} />
        <input type="button" value="reverse" onClick={()=>reverse()} />
        <input type="button" value=">" onClick={()=>nextFrame(1)} />
        <input className="hide-xs" type="button" value=">>" onClick={()=>nextFrame(10)} />
        <input type="button" value=">>>" onClick={()=>nextFrame(100)} />
      </div>
    </div>
  );
}