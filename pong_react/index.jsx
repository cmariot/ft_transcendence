import React from 'react'; /* React is JS lib buildon UI interactive apps Web/Mobile*/
import ReactDOM from 'react-dom/client'; /* ReactDOM is for web */
import './index.css';


import { Board } from './Board.jsx';
// import { Ball } from './Ball.jsx';
// import { Paddles } from './Paddles.jsx';



// ============================================================================//
// Pong Game  : Main component 
// ============================================================================//
class Game extends React.Component {

    render() {
      return(
    <div className="App">
        <Board /> 
    </div>    
  )
    }
}  

// ============================================================================//

// create a root element
// React Dom is for web it will render the game component in the root element
const root = ReactDOM.createRoot(document.getElementById("root"));

window.setInterval(() => {root.render(<Game />);}, 1000);