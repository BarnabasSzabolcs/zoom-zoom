import { useState } from 'react';
import { Display } from './components/Display';
import { HUD } from './components/HUD';

import './App.css';

interface Props{
}

const App = (props: Props) => {
  const [direction, setDirection] = useState(1);
  const [animIndex, setAnimIndex] = useState(0);
  const [play, setPlay] = useState(false);

  return (
    <div className="App">
      <Display 
        animIndex={animIndex}
        onAnimIndexChange={setAnimIndex}
        play={play}
        direction={direction}
        />
      <HUD 
        animIndex={animIndex}
        onAnimIndexChange={setAnimIndex}
        play={play}
        onPlayChange={setPlay}
        direction={direction}
        onDirectionChange={setDirection}
        />
    </div>
  );
}

export default App;
