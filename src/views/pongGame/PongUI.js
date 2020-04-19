import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useTransition, animated } from 'react-spring';

import { GAME_HEIGHT, GAME_WIDTH } from './config';

const LEFT_UI_WIDTH = 50;

function calculateLeftOffset() {
  return window.innerWidth / 2 - GAME_WIDTH / 2;
}

function PongUI({ pongGame }) {
  const [leftOffset, setLeftOffset] = useState(calculateLeftOffset());

  function handleResize() {
    setLeftOffset(calculateLeftOffset);
  }

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const transitions = useTransition(pongGame.showUI, null, {
    from: { marginTop: -100 },
    enter: { marginTop: 0 },
    leave: { marginTop: -100 },
  });

  return (
    <div>
      {/* Top */}
      <div>
        {transitions.map(
          ({ item, key, props }) =>
            item && (
              <animated.div
                key={key}
                style={{
                  ...props,
                  position: 'absolute',
                  width: GAME_WIDTH,
                  height: 100,
                  top: 0,
                  backgroundColor: '#fcfcfc',
                }}
              />
            )
        )}
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  pongGame: state.pongGame,
});

export default connect(mapStateToProps)(PongUI);
