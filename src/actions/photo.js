/**
 * Created by Administrator on 2017/3/8.
 */
import configJson from 'configJson' ;
import axios from 'axios';
export const GET_PHOTO_SUCCESS = 'GET_PHOTO_SUCCESS';
export const GET_PHOTO_FAIL = 'GET_PHOTO_FAIL';
export const RESET_PHOTO = 'RESET_PHOTO';

export function resetPhoto() {
    return dispatch => {
        dispatch({
            type: RESET_PHOTO,
        });
    }
}

export function getPhoto({cb,params}) {
    return dispatch => {
        axios({
            url: `${configJson.prefix}/api/photos`,
            method: 'get',
            params:{
                ...params
            }
        })
            .then(function (response) {
                console.log(response);
                if (response.status === 200) {
                    dispatch({
                        type: GET_PHOTO_SUCCESS,
                        payload: response.data,
                    });
                    if(cb)cb()
                } else {
                    dispatch({
                        type: GET_PHOTO_FAIL,
                    });
                }
            })
            .catch(function (error) {
                console.log(error)
            });
    }
}




