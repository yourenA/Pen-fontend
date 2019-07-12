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
export const ADD_COMMENT_SUCCESS = 'ADD_COMMENT_SUCCESS';
export const ADD_COMMENT_FAIL = 'ADD_COMMENT_FAIL';
export const GET_COMMENTS_SUCCESS = 'GET_COMMENTS_SUCCESS';
export const GET_COMMENTS_FAIL = 'GET_COMMENTS_FAIL';
export const CHANGE_SHOW_MORE = 'CHANGE_SHOW_MORE';
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
export function changeShowMore() {
    return dispatch => {
        dispatch({
            type: CHANGE_SHOW_MORE,
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
export function sendComment(params,cb) {
    console.log('params',params)
    return dispatch => {
        axios({
            url: `${configJson.prefix}/api/comment`,
            method: 'post',
            data:params
        })
            .then(function (response) {
                console.log(response);
                if (response.status === 200) {
                    dispatch({
                        type: ADD_COMMENT_SUCCESS,
                        payload: {status:1,msg:'添加评论成功'},
                    });
                    if(cb)cb()
                } else {
                    dispatch({
                        type: ADD_COMMENT_FAIL,
                        payload: {status:-1,msg:response.data.message},
                    });
                }
            })
            .catch(function (error) {
                if (error.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    console.log(error.response.data);
                    dispatch({
                        type: ADD_COMMENT_FAIL,
                        payload: {status:-1,msg:error.response.data.message},
                    });
                } else if (error.request) {
                    console.log(error.request);
                } else {
                    console.log('Error', error.message);
                }
            });
    }
}


export function getComents(id) {
    return dispatch => {
        axios({
            url: `${configJson.prefix}/api/comments`,
            method: 'get',
            params:{
                id:id
            }
        })
            .then(function (response) {
                console.log(response);
                if (response.status === 200) {
                    dispatch({
                        type: GET_COMMENTS_SUCCESS,
                        payload: response.data.rows,
                    });
                } else {
                    dispatch({
                        type: GET_COMMENTS_FAIL,
                    });
                }
            })
            .catch(function (error) {
                console.log(error)
            });
    }
}

export function getOnePost(id,cb) {
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
                    if(cb){
                        cb()
                    }
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

