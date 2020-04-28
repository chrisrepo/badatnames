import React from 'react';

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
/**
 *
 * @param wordOptions - array of word options
 * @param wordSelected - Function callback to parent for firing event on selecting word
 */
const PreGuessModal = ({ show, wordOptions, wordSelected }) => {
  return (
    <Modal show={show} onHide={() => {}}>
      <Modal.Header closeButton>
        <Modal.Title>Select a word to draw</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {wordOptions.map((word, index) => {
          return (
            <Button
              key={word}
              className="pre-guess-button"
              variant="info"
              onClick={() => wordSelected(word, index)}
            >
              {word}
            </Button>
          );
        })}
      </Modal.Body>
    </Modal>
  );
};

export default PreGuessModal;
