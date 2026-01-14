import {createSlice} from '@reduxjs/toolkit'


 const initialState = {
    temperatureUnit: 'C',
 };

 const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        setTemperatureUnit: (state, action) => {
            state.temperatureUnit = action.payload;
        }
    }
 })

export const {setTemperatureUnit} = settingsSlice.actions;
export default settingsSlice.reducer;