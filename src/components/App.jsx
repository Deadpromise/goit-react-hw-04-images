import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { AppContainer } from './App.styled';
import { Searchbar } from './Searchbar/Searchbar';
import { Loader } from './Loader/Loader';
import getImgs from 'services/pixabay-api';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Button } from './Button/Button';
import { Modal } from './Modal/Modal';
import Notiflix from 'notiflix';

const Status = {
  IDLE: 'idle',
  PENDING: 'pending',
  RESOLVED: 'resolved',
  REJECTED: 'rejected',
};

export const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [results, setResults] = useState([]);
  const [status, setStatus] = useState(Status.IDLE);
  const [showModal, setShowModal] = useState(false);
  const [largeImage, setLargeImage] = useState({
    largeImageURL: '',
    largeImageAlt: '',
  });

  const onFormSubmit = inputData => {
    if (inputData === searchQuery) {
      return;
    }
    setResults([]);
    setPage(1);
    setSearchQuery(inputData);
    setStatus(Status.PENDING);
  };

  const pageIncr = currentPage => {
    setPage(currentPage + 1);
  };

  const onLoadMore = () => {
    pageIncr(page);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const getBigImage = e => {
    const goalObj = results.filter(el => el.id === Number(e.target.id));
    if (goalObj.length === 0) {
      return;
    }
    setShowModal(true);
    setLargeImage({
      largeImageURL: goalObj[0].largeImageURL,
      largeImageAlt: goalObj[0].tags,
    });
  };
  useEffect(() => {
    if (searchQuery === '') {
      return;
    }
    setStatus(Status.PENDING);
    getImgs(searchQuery, page)
      .then(result => {
        if (result.hits.length === 0) {
          setStatus(Status.REJECTED);
          Notiflix.Notify.failure(
            "Sorry, there are no images matching your search query or you've reached the end of search results."
          );
          return;
        }
        setResults(prevResults => [...prevResults, ...result.hits]);
        setStatus(Status.RESOLVED);
      })
      .catch(() => {
        setStatus(Status.REJECTED);
        Notiflix.Notify.failure(
          "We're sorry, but you've reached the end of search results."
        );
      });
  }, [page, searchQuery]);

  const pending = status === 'pending';
  const resolved = status === 'resolved';
  const showBtn = results.length < 12;
  const { largeImageURL, largeImageAlt } = largeImage;
  return (
    <AppContainer>
      <Searchbar onSubmit={onFormSubmit}></Searchbar>
      <ImageGallery onClick={getBigImage} results={results}></ImageGallery>
      {pending && <Loader></Loader>}
      {results.length !== 0 && resolved && !showBtn && (
        <Button onClick={onLoadMore}></Button>
      )}
      {showModal && (
        <Modal
          onClose={closeModal}
          imgUrl={largeImageURL}
          imgAlt={largeImageAlt}
        ></Modal>
      )}
    </AppContainer>
  );
};

App.propTypes = {
  searchQuery: PropTypes.string,
  page: PropTypes.number,
  results: PropTypes.arrayOf(PropTypes.shape({})),
  status: PropTypes.string,
  showModal: PropTypes.bool,
  largeImage: PropTypes.shape({
    largeImageURL: PropTypes.string,
    largeImageAlt: PropTypes.string,
  }),
};
