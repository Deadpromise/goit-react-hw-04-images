import { useState } from 'react';
import Notiflix from 'notiflix';
import PropTypes from 'prop-types';
import {
  SearchHeader,
  SearchForm,
  SearchButton,
  SearchButtonLabel,
  SearchInput,
} from './Searchbar.styled';

export const Searchbar = ({ onSubmit }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const getInputData = e => {
    setSearchQuery(e.currentTarget.value);
  };

  const onFormSubmit = e => {
    e.preventDefault();
    if (searchQuery.trim() === '') {
      Notiflix.Notify.warning('Please, enter something.');
      return;
    }
    onSubmit(searchQuery);
  };

  return (
    <SearchHeader>
      <SearchForm onSubmit={onFormSubmit}>
        <SearchButton type="submit">
          <SearchButtonLabel>Search</SearchButtonLabel>
        </SearchButton>
        <SearchInput
          type="text"
          autoComplete="off"
          autoFocus
          placeholder="Search images and photos"
          onChange={getInputData}
          value={searchQuery}
        ></SearchInput>
      </SearchForm>
    </SearchHeader>
  );
};
Searchbar.propTypes = {
  searchQuery: PropTypes.string,
  onSubmit: PropTypes.func.isRequired,
};
