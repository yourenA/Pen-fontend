/**
 * Created by Administrator on 2017/3/8.
 */
import {GET_POST_FAIL,GET_POST_SUCCESS,RESET_POST,GET_CATEGORY_SUCCESS,RESET_DETAIL,GET_ONE_POST_SUCCESS,GET_ONE_POST_FAIL
,SAVE_SCROLL,ADD_COMMENT_SUCCESS,ADD_COMMENT_FAIL,GET_COMMENTS_SUCCESS,GET_COMMENTS_FAIL} from '../actions/post';
const initState = {
    loaded: false,
    data: [],
    lastPage: 1,
    pagination:{},
    active_category:'all',
    category:[],
    detail:{},
    scrollTop:0,
    status:0,
    msg:'',
    comments:[],

};
export default function photo(state = initState, action) {
    switch (action.type) {
        case SAVE_SCROLL:
            return Object.assign({}, state, {
                scrollTop:action.payload
            });
        case RESET_POST:
            return Object.assign({}, state, {
                loaded: false,
                data: [],
                lastPage: 1,
            });
        case RESET_DETAIL:
            return Object.assign({}, state, {
                detail:{},
            });
        case GET_POST_SUCCESS:
            return Object.assign({}, state, {
                loaded: true,
                data: action.payload.rows,
                lastPage: action.payload.lastPage,
                pagination:action.payload.meta.pagination,
                active_category:action.payload.active_category
            });
        case GET_CATEGORY_SUCCESS:
            action.payload.rows.unshift({id:'all',name:'全部'})
            return Object.assign({}, state, {
                category:action.payload.rows,

            });
        case GET_ONE_POST_SUCCESS:
            return Object.assign({}, state, {
                detail:action.payload,

            });
        case GET_COMMENTS_SUCCESS:
            return Object.assign({}, state, {
                comments:action.payload,

            });
        case GET_POST_FAIL:
            return Object.assign({}, state, {loaded: false});

        case ADD_COMMENT_SUCCESS:
        case ADD_COMMENT_FAIL:
            return Object.assign({}, state, {
                status:action.payload.status,
                msg:action.payload.msg,
            });
        default:
            return state;
    }
}