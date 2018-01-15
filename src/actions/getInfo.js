/**
 * Created by Administrator on 2017/3/8.
 */
import configJson from 'configJson' ;
import axios from 'axios';
export const GET_BASEINFO_SUCCESS = 'GET_BASEINFO_SUCCESS';
export const GET_BASEINFO_FAIL = 'GET_BASEINFO_FAIL';
export const GET_CONTACT_SUCCESS = 'GET_CONTACT_SUCCESS';
export const GET_CONTACT_FAIL = 'GET_CONTACT_FAIL';
export const GET_LINK_SUCCESS = 'GET_LINK_SUCCESS';
export const GET_LINK_FAIL = 'GET_LINK_FAIL';

export function getBaseInfo() {
    return dispatch => {
        axios({
            url: `${configJson.prefix}/baseInfo`,
            method: 'get',
        })
            .then(function (response) {
                console.log(response);
                if (response.data.status === 200) {
                    dispatch({
                        type: GET_BASEINFO_SUCCESS,
                        payload: response.data.data[0],
                    });
                } else {
                    dispatch({
                        type: GET_BASEINFO_FAIL,
                    });
                }
            })
            .catch(function (error) {
                console.log(error)
            });
    }
}

export function getContact() {
    return dispatch => {
        axios({
            url: `${configJson.prefix}/contact`,
            method: 'get',
        })
            .then(function (response) {
                console.log(response);
                if (response.data.status === 200) {
                    dispatch({
                        type: GET_CONTACT_SUCCESS,
                        payload: response.data.data[0],
                    });
                } else {
                    dispatch({
                        type: GET_CONTACT_FAIL,
                    });
                }
            })
            .catch(function (error) {
                console.log(error)
            });
    }
}

export function getLink() {
    return dispatch => {
        axios({
            url: `${configJson.prefix}/link`,
            method: 'get',
        })
            .then(function (response) {
                console.log(response);
                if (response.data.status === 200) {
                    dispatch({
                        type: GET_LINK_SUCCESS,
                        payload: response.data.data,
                    });
                } else {
                    dispatch({
                        type: GET_LINK_FAIL,
                    });
                }
            })
            .catch(function (error) {
                console.log(error)
            });
    }
}



