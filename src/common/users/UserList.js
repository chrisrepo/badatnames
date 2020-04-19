import React from 'react';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';

import player1 from '../../img/paint/paint-player-1.svg';

const UserList = (props) => {
  const { lobby } = props;
  return (
    <Container>
      <div id="player-card-container">
        {Object.keys(lobby.clientList).map((key, index) => {
          const client = lobby.clientList[key];
          const isHost = lobby.host === key;
          return (
            <Card key={key} border="info" style={{ width: '140px' }}>
              <Card.Img variant="top" src={player1} />
              <Card.Body>
                <Card.Title>{client.username}</Card.Title>
                {isHost && <Card.Text>HOST</Card.Text>}
              </Card.Body>
            </Card>
          );
        })}
      </div>
    </Container>
  );
};

export default UserList;
