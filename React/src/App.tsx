import React from 'react';
import { Display } from './components/Display';
import { HUD } from './components/HUD';

import './App.css';

interface State{
  animIndex: number,
  play: boolean,
  direction: number
}
interface Props{
}

class App extends React.Component<Props, State> {
  constructor(props: Props){
    super(props)
    this.state = {
      direction: 1,
      animIndex: 0,
      play: false
    }
  }
  render() {
    return (
      <div className="App">
        <Display 
          animIndex={this.state.animIndex}
          onAnimIndexChange={animIndex=>this.setState({animIndex})}
          play={this.state.play}
          direction={this.state.direction}/>
        <HUD 
          animIndex={this.state.animIndex}
          onAnimIndexChange={animIndex=>this.setState({animIndex})}
          play={this.state.play}
          onPlayChange={play=>this.setState({play})}
          direction={this.state.direction}
          onDirectionChange={direction=>this.setState({direction})}
          />
      </div>
    );
  }
}

export default App;
