
import { configureStore } from '@reduxjs/toolkit';
import settingsReducer from './slices/settingsSlice';
import favoritesReducer from './slices/favoritesSlice';

const loadState = () => {
  try {

    const serializedState = localStorage.getItem('weatherAppState');

    if (serializedState === null) {
      return undefined;
    }


    return JSON.parse(serializedState);
  } catch (err) {
    console.error('Błąd ładowania stanu z localStorage:', err);
    return undefined;
  }
};




const saveState = (state) => {
  try {
    const stateToSave = {
      settings: state.settings,
      favorites: state.favorites,
    };

    const serializedState = JSON.stringify(stateToSave);
    localStorage.setItem('weatherAppState', serializedState);
  } catch (err) {
    console.error('Błąd zapisywania stanu do localStorage:', err);
  }
};


const preloadedState = loadState();


const store = configureStore({
  reducer: {
    settings: settingsReducer,
    favorites: favoritesReducer,
  },
  preloadedState,
});


store.subscribe(() => {
  saveState(store.getState());
});

export default store;
