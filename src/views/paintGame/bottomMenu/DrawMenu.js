import React from 'react';
import './DrawMenu.css';
import ClearCanvasButton from './ClearCanvasButton';
import ColorSelector from './ColorSelector';
import BrushSelector from './BrushSelector';

class DrawMenu extends React.Component {
  render() {
    return (
      <div className="menu-wrapper">
        <ColorSelector />
        <BrushSelector />
        <ClearCanvasButton />
      </div>
    );
  }
}
export default DrawMenu;
