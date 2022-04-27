import React from 'react';

import './HUD.css';

interface Props{
  animIndex: number,
  onAnimIndexChange: (animIndex: number)=>void,
  play: boolean,
  onPlayChange: (play: boolean)=>void
}

export class HUD extends React.Component<Props> {
  nextFrame(n: number){
    this.props.onAnimIndexChange((this.props.animIndex+n));
  }

  togglePlay(){
    this.props.onPlayChange(!this.props.play)
  }
  render(){
    return (
      <div className="HUD">
           <div className="frame-counter">{this.props.animIndex}</div>
        <input type="button" value="<<<" onClick={()=>this.nextFrame(-100)} />
        <input type="button" value="<<" onClick={()=>this.nextFrame(-10)} />
        <input type="button" value="<" onClick={()=>this.nextFrame(-1)} />
        <input type="button" value=">" onClick={()=>this.nextFrame(1)} />
        <input type="button" value=">>" onClick={()=>this.nextFrame(10)} />
        <input type="button" value=">>>" onClick={()=>this.nextFrame(100)} />
        <input type="button" value="play/stop" onClick={()=>this.togglePlay()} />
      </div>
    );
  }
}