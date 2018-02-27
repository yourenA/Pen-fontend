/**
 * Created by Administrator on 2017/3/8.
 */
import configJson from 'configJson' ;
import axios from 'axios';
export const GET_RECORD_SUCCESS = 'GET_RECORD_SUCCESS';
export const GET_RECORD_FAIL = 'GET_RECORD_FAIL';
export const RESET_RECORD = 'RESET_RECORD';

export function resetRecord() {
    return dispatch => {
        dispatch({
            type: RESET_RECORD,
        });
    }
}

export function getRecord({cb,params}) {
    return dispatch => {
        axios({
            url: `${configJson.prefix}/api/words`,
            method: 'get',
            params:{
                ...params
            }
        })
            .then(function (response) {
                console.log(response);
                if (response.status === 200) {
                    dispatch({
                        type: GET_RECORD_SUCCESS,
                        payload: response.data,
                    });
                    if(cb)cb()
                } else {
                    dispatch({
                        type: GET_RECORD_FAIL,
                    });
                }
            })
            .catch(function (error) {
                console.log(error)
            });
    }
}




