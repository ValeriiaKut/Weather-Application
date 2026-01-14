import { useDispatch, useSelector } from "react-redux";
import { setTemperatureUnit } from "../store/slices/settingsSlice";

function UnitSwitcher(){
    const currentUnit = useSelector((state) => state.settings.temperatureUnit);
    const dispatch = useDispatch();
    const handleChange = (e) => {
        dispatch(setTemperatureUnit(e.target.value));
    }
    return(
        <div className="unit-switcher">
            <label>Jednostka temperatury: </label>
            <select value={currentUnit} onChange={handleChange}>
                <option value='C'>Celcjusz</option>
                 <option value='F'>Fa</option>
                  <option value='K'>Ka</option>
            </select>
        </div>
    )
}

export default UnitSwitcher;