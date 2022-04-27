import React from 'react';

import './Display.scss';

interface Props{
  animIndex: number,
  play: boolean,
  onAnimIndexChange: (animIndex: number)=>void
}
interface ConfItem{
  text: string, 
  translateX: number, 
  translateY: number,
  style: React.CSSProperties
}
interface State{
  direction: number,
  conf: ConfItem[],
  grey: boolean,
  containerStyle: React.CSSProperties,
  testText: string,
  _intervalId: ReturnType<typeof setInterval> | undefined,
  animIndex: number
}

const animLength = 1000;
const refreshRate = 20; // in ms

const svgHtml = `
<svg viewBox="0 0 1234 7" xmlns="http://www.w3.org/2000/svg">
  <style>
  .t{font: 10px serif;color:black;}
  </style>
  <text x="0" y="6.8" class="t">TEXT</text>
</svg>`.replace(/\n */g, '');

export class Display extends React.Component<Props, State> {
  private testTextDiv: React.RefObject<HTMLInputElement>;

  constructor(props: Props){
    super(props)
    const myConf = [
      {text: 'Turtle', translateX: -57.6, translateY: 0.9}, // in %
      {text: 'Giant', translateX: 0.05, translateY: 0.9}, // in %
      {text: 'Mountain', translateX: 9.7, translateY: 0.9}, // in %
    ];
    let conf: ConfItem[] = [];
    for (let o of myConf){
      conf.push({style: {backgroundImage: 'none'}, ...o})
    }
    this.state = {
      direction: 0,
      conf,
      grey: false,
      containerStyle: {transform: 'none'},
      testText: '',
      _intervalId: undefined,
      animIndex: 0
    }
    this.testTextDiv = React.createRef();    
  }

  async componentDidMount() {
    await this._initSizes();
    this.nextFrame(0);
    this.updateIntervalId(this.props.play);
  }
  private async _initSizes(){
    for(const o of this.state.conf){
       const width = await this._getWidth(o.text);
       const svg_i = svgHtml.replace('TEXT', o.text).replace('1234', width.toString());
       o.style = {backgroundImage: `url('data:image/svg+xml;utf8,${svg_i}')`};
       console.log(width, o.text, o.style);
    }
    this.setState({conf: this.state.conf});
    console.log(this.state.conf);
  }
  private _getWidth (text: string): Promise<number>{
    this.setState({testText: text});
    return new Promise(resolve=>{   
       setTimeout(()=>{
        const dims = this.testTextDiv.current?.getBoundingClientRect() || {width: 0, height: 1};
        resolve(dims.width);
       }, 0);
    })
  }
  private updateIntervalId(play: boolean){
    if (play && this.state._intervalId === undefined){
      const _intervalId = setInterval(()=>{ this.nextFrame() }, refreshRate);
      this.setState({_intervalId});
    } 
    else if (play===false && this.state._intervalId !== undefined){
      clearInterval(this.state._intervalId);
      this.setState({_intervalId: undefined})
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.play !== this.props.play) {
      this.updateIntervalId(this.props.play);
    }
    if (this.props.animIndex !== prevProps.animIndex 
      && this.props.animIndex !== this.state.animIndex){
      this.nextFrame(this.props.animIndex - this.state.animIndex);
    }
  }

  nextFrame(nStep: number=1): void {
    console.log('nextFrame!', nStep);
    let animIndex = this.state.animIndex;
    animIndex = (animIndex + nStep) % animLength;
    let conf = this.state.conf;
    if(animIndex<0 && animIndex>=nStep){ // handling rotating back texts on prev actions
      const n_1 = conf.length - 1;
      const last = conf[n_1];
      conf = [last].concat(conf.slice(0, n_1));
      console.log('switch back', JSON.stringify(conf));
      this.setState({conf});
      animIndex += animLength;
    }
    const maxAlpha = Math.pow(1.5, (animLength-1)/100.0) - 1;
    const alpha = (Math.pow(1.5, animIndex/100.0) - 1)/maxAlpha;
    const scaleMin = 0.1;
    const scaleMax = 70*scaleMin;
    const scale = scaleMin*(1-alpha) + scaleMax*alpha;
    const translateX = conf[1].translateX * alpha;
    const translateY = conf[1].translateY * alpha;
    this.setState({containerStyle: {transform: `translate(${translateX}%, ${translateY}%) scale(${scale})`}});
    document.documentElement.style.setProperty('--grey-opacity', (1.0-1.4*scale).toString());
    this.setState({grey: scale < 0.5});
    if(nStep>0 && animIndex<nStep){
      console.log('switch forward');
       const first = conf[0];
       conf = conf.slice(1);
       conf.push(first);
       console.log(JSON.stringify(conf));
       this.setState({conf});
    }
    this.setState({animIndex});
    this.props.onAnimIndexChange(animIndex);
  }

  render(){
    return (
      <div className="Display">
        <div className="c">
          <div className="container" style={this.state.containerStyle}>
              <div className={'foreground three ' + (this.state.grey ? 'grey': '')}
                  style={this.state.conf[2].style}>
                <div className="foreground two" style={this.state.conf[1].style}>
                    <div className="foreground one" style={this.state.conf[0].style}>
                    </div>
                </div>
              </div>
          </div>
        </div>
        <div className="hidden">{svgHtml}</div>
        <div className="test" ref={this.testTextDiv}>{this.state.testText}</div>
      </div>
    ); 
  }
}