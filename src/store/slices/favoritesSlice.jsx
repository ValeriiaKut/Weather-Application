import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    favoriteIds: [],
};

const favoritesSlice = createSlice({
    name: "favorites",
    initialState,
    reducers: {
        toggleFavorite: (state, action) => {
            const cityId = action.payload;
            const index = state.favoriteIds.indexOf(cityId);

            if (index === -1) {
                state.favoriteIds.push(cityId);
            } else {
                state.favoriteIds.splice(index, 1);
            }
        },
    },
});

export const { toggleFavorite } = favoritesSlice.actions;
export default favoritesSlice.reducer;
