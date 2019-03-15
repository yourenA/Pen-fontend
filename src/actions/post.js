/**
 * Created by Administrator on 2017/3/8.
 */
import configJson from 'configJson' ;
import axios from 'axios';
export const GET_POST_SUCCESS = 'GET_POST_SUCCESS';
export const GET_POST_FAIL = 'GET_POST_FAIL';
export const RESET_POST = 'RESET_POST';
export const RESET_DETAIL = 'RESET_DETAIL';
export const GET_CATEGORY_SUCCESS = 'GET_CATEGORY_SUCCESS';
export const GET_CATEGORY_FAIL = 'GET_CATEGORY_FAIL';
export const GET_ONE_POST_SUCCESS = 'GET_ONE_POST_SUCCESS';
export const GET_ONE_POST_FAIL = 'GET_ONE_POST_FAIL';
export const SAVE_SCROLL = 'SAVE_SCROLL';


export function getCategory(params) {
    return dispatch => {
        axios({
            url: `${configJson.prefix}/api/category`,
            method: 'get',
            params:{
                ...params
            }
        })
            .then(function (response) {
                console.log(response);
                if (response.status === 200) {
                    dispatch({
                        type: GET_CATEGORY_SUCCESS,
                        payload: response.data,
                    });
                } else {
                    dispatch({
                        type: GET_CATEGORY_FAIL,
                    });
                }
            })
            .catch(function (error) {
                console.log(error)
            });
    }
}
export function resetPost() {
    return dispatch => {
        dispatch({
            type: RESET_POST,
        });
    }
}
export function resetDetail() {
    return dispatch => {
        dispatch({
            type: RESET_DETAIL,
        });
    }
}

export function getPost({cb,params}) {
    let sendparams={...params}
    if(sendparams.category==='all'){
        sendparams.category=null
    }
    return dispatch => {
        axios({
            url: `${configJson.prefix}/api/code`,
            method: 'get',
            params:{
                ...sendparams
            }
        })
            .then(function (response) {
                console.log(response);
                if (response.status === 200) {
                    dispatch({
                        type: GET_POST_SUCCESS,
                        payload: {active_category:params.category,...response.data},
                    });
                    if(cb)cb()
                } else {
                    dispatch({
                        type: GET_POST_FAIL,
                    });
                }
            })
            .catch(function (error) {
                console.log(error)
            });
    }
}

export function getOnePost(id) {
    return dispatch => {
        axios({
            url: `${configJson.prefix}/api/code/${id}`,
            method: 'get',
        })
            .then(function (response) {
                console.log(response);
                if (response.status === 200) {
                    dispatch({
                        type: GET_ONE_POST_SUCCESS,
                        payload: response.data,
                    });
                } else {
                    dispatch({
                        type: GET_ONE_POST_FAIL,
                    });
                }
            })
            .catch(function (error) {
                console.log(error)
            });
    }
}


export function saveScroll(scrollTop) {
    return dispatch => {
        dispatch({
            type: SAVE_SCROLL,
            payload: scrollTop,
        });
    }
}

