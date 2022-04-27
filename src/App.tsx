import React from 'react';
import { Display } from './components/Display';
import { HUD } from './components/HUD';

import './App.css';

interface State{
  animIndex: number,
  play: boolean
}
interface Props{
}

class App extends React.Component<Props, State> {
  constructor(props: Props){
    super(props)
    this.state = {
      animIndex: 0,
      play: false
    }
  }
  render() {
    return (
      <div className="App">
        <Display 
          animIndex={this.state.animIndex}
          play={this.state.play}
          onAnimIndexChange={animIndex=>this.setState({animIndex})}/>
        <HUD 
          animIndex={this.state.animIndex}
          onAnimIndexChange={animIndex=>this.setState({animIndex})}
          play={this.state.play}
          onPlayChange={play=>this.setState({play})}
          />
      </div>
    );
  }
}

export default App;
