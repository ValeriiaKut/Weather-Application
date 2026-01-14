import { useSelector, useDispatch } from 'react-redux';
import { toggleFavorite } from '../store/slices/favoritesSlice';

function FavoriteButton({ cityId }) {

    const dispatch = useDispatch();

    const favoriteIds = useSelector((state) =>
        state.favorites.favoriteIds);

    const isFavorite = favoriteIds.includes(cityId);

    const handleClick = (e) => {

        e.stopPropagation();

        dispatch(toggleFavorite(cityId));
    }

    return (
        <button className="favorite" onClick={handleClick}>
            {isFavorite ? '⭐️' : '☆'}

        </button>
    )
}
export default FavoriteButton;