/**
 * Created by Administrator on 2017/3/8.
 */
import {GET_PHOTO_FAIL,GET_PHOTO_SUCCESS,RESET_PHOTO} from '../actions/photo';
const initState = {
    loading: true,
    data: [],
    lastPage: 1,
};
export default function photo(state = initState, action) {
    switch (action.type) {
        case RESET_PHOTO:
            return Object.assign({}, state, {
                loading: true,
                data: [],
                lastPage: 1,
            });
        case GET_PHOTO_SUCCESS:
            return Object.assign({}, state, {
                loading: false,
                data: state.data.concat(action.payload.rows),
                lastPage: action.payload.lastPage
            });
        case GET_PHOTO_FAIL:
            return Object.assign({}, state, {loading: true});
        default:
            return state;
    }
}