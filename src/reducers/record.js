/**
 * Created by Administrator on 2017/3/8.
 */
import {GET_RECORD_FAIL, GET_RECORD_SUCCESS, RESET_RECORD} from '../actions/record';
const initState = {
    loading: true,
    data: [],
    lastPage: 1,
};
export default function record(state = initState, action) {
    switch (action.type) {
        case RESET_RECORD:
            return Object.assign({}, state, {
                loading: true,
                data: [],
                lastPage: 1,
            });
        case GET_RECORD_SUCCESS:
            return Object.assign({}, state, {
                loading: false,
                data: state.data.concat(action.payload.rows),
                lastPage: action.payload.lastPage
            });
        case GET_RECORD_FAIL:
            return Object.assign({}, state, {loading: true});
        default:
            return state;
    }
}