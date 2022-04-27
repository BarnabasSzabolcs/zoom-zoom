import {useState, useRef, CSSProperties, useEffect } from 'react';
import { useInterval, usePrevious } from '../utilities';


import './Display.scss';

interface Props{
  animIndex: number,
  direction: number,
  play: boolean,
  onAnimIndexChange: (animIndex: number)=>void
}
interface ConfItem{
  text: string, 
  translateX: number, 
  translateY: number,
  style: CSSProperties
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

export const Display =(props: Props) => {
  const testTextDiv = useRef<HTMLInputElement>(null);

  const myConf = [
    {text: 'Turtle', translateX: -57.6, translateY: 0.9}, // in %
    {text: 'Giant', translateX: 0.05, translateY: 0.9}, // in %
    {text: 'Mountain', translateX: 9.7, translateY: 0.9}, // in %
  ];
  let confItems: ConfItem[] = [];
  for (let o of myConf){
    confItems.push({style: {backgroundImage: 'none'}, ...o})
  }
  const [conf, setConf] = useState(confItems);
  const [grey, setGrey] = useState(false);
  const [containerStyle, setContainerStyle] = useState<CSSProperties>({transform: 'none'});
  const [testText, setTestText] = useState('');
  // const [ _intervalId, setIntervalId] = useState<ReturnType<typeof setInterval> | undefined>(undefined);
  const [animIndex, setAnimIndex] = useState(0);

  // componentDidMount
  useEffect(() => {
    const doIt =async ()=>{ 
      await _initSizes();
      nextFrame(0);
      // updateIntervalId();
    };
    doIt();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const _initSizes= async()=>{
    for(const o of conf){
       const width = await _getWidth(o.text);
       const svg_i = svgHtml.replace('TEXT', o.text).replace('1234', width.toString());
       o.style = {backgroundImage: `url('data:image/svg+xml;utf8,${svg_i}')`};
    }
    setConf(conf);
  }
  const _getWidth = (text: string): Promise<number> => {
    setTestText(text);
    return new Promise(resolve=>{   
       setTimeout(()=>{
        const dims = testTextDiv.current?.getBoundingClientRect() || {width: 0, height: 1};
        resolve(dims.width);
       }, 0);
    })
  }

  useInterval(()=>{
    nextFrame(props.direction * 3);
  }, props.play ? refreshRate : null);

  const prev = usePrevious(props);
  const prevIndex = usePrevious(animIndex);

  useEffect(()=>{
    if(prevIndex !== animIndex){
      // console.log('set:', animIndex);
      props.onAnimIndexChange(animIndex);
    }
    else if (props.animIndex !== prev?.animIndex 
      && props.animIndex !== animIndex){
      // console.log('sync', props.animIndex, animIndex);
      nextFrame(props.animIndex - animIndex);
    }
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.animIndex, animIndex]);

  const nextFrame = (nStep: number=1) => {
    // console.log('nf:', animIndex);
    let iAnim: number = animIndex;
    iAnim = (iAnim + nStep) % animLength;
    let myConf = conf;
    if(iAnim<0 && iAnim>=nStep){ // handling rotating back texts on prev actions
      const n_1 = conf.length - 1;
      const last = conf[n_1];
      myConf = [last].concat(conf.slice(0, n_1))
      setConf(myConf);
      iAnim += animLength;
    }
    setAnimIndex(_=>iAnim);
    const maxAlpha = Math.pow(1.5, (animLength-1)/100.0) - 1;
    const alpha = (Math.pow(1.5, iAnim/100.0) - 1)/maxAlpha;
    const scaleMin = 0.1;
    const scaleMax = 70*scaleMin;
    const scale = scaleMin*(1-alpha) + scaleMax*alpha;
    const translateX = myConf[1].translateX * alpha;
    const translateY = myConf[1].translateY * alpha;
    setContainerStyle({transform: `translate(${translateX}%, ${translateY}%) scale(${scale})`});
    document.documentElement.style.setProperty('--grey-opacity', (1.0-1.4*scale).toString());
    setGrey(scale < 0.5);
    if(nStep>0 && iAnim<nStep){
       const first = myConf[0];
       myConf = myConf.slice(1);
       myConf.push(first);
       setConf(myConf);
    }
  }

  return (
    <div className="Display">
      <div className="c">
        <div className="container" style={containerStyle}>
            <div className={'foreground three ' + (grey ? 'grey': '')}
                style={conf[2].style}>
              <div className="foreground two" style={conf[1].style}>
                  <div className="foreground one" style={conf[0].style}>
                  </div>
              </div>
            </div>
        </div>
      </div>
      <div className="hidden">{svgHtml}</div>
      <div className="test" ref={testTextDiv}>{testText}</div>
    </div>
  ); 
}