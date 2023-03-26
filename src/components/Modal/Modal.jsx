import { useEffect } from 'react';
import { ModalOverlay, ModalWindow, ModalImage } from './Modal.styled';
import PropTypes from 'prop-types';

export const Modal = ({ imgUrl, imgAlt, onClose }) => {
  useEffect(() => {
    window.addEventListener('keydown', onKeyDown);
  });

  useEffect(() => {
    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  });

  const onKeyDown = e => {
    if (e.code === 'Escape') {
      onClose();
    }
  };

  const onBackdropClick = e => {
    if (e.currentTarget === e.target) {
      onClose();
    }
  };

  return (
    <ModalOverlay onClick={onBackdropClick}>
      <ModalWindow>
        <ModalImage src={imgUrl} alt={imgAlt}></ModalImage>
      </ModalWindow>
    </ModalOverlay>
  );
};

Modal.propTypes = {
  onClose: PropTypes.func.isRequired,
  imgUrl: PropTypes.string.isRequired,
  imgAlt: PropTypes.string.isRequired,
};
