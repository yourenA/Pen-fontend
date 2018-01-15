/**
 * Created by Administrator on 2017/3/8.
 */
import {GET_BASEINFO_FAIL,GET_BASEINFO_SUCCESS,GET_CONTACT_SUCCESS,GET_CONTACT_FAIL,GET_LINK_SUCCESS,GET_LINK_FAIL} from '../actions/getInfo';
import configJson from 'configJson' ;
const initState={
    loading:false,
    logoUrl:'',
    name:'',
    description:'',
    copyright:'',
    address:'',
    tel:'',
    fax:'',
    email:'',
    contactUrl:'',
    link:[]
};
export default function baseInfo(state = initState ,action){
    switch (action.type){
        case GET_BASEINFO_SUCCESS:
            return Object.assign({},state,{loading:true,logoUrl:`${configJson.prefix}${action.payload.logoUrl}`,name:action.payload.name,description:action.payload.description,copyright:action.payload.copyright});
        case GET_BASEINFO_FAIL:
            return Object.assign({},state,{login:false});
        case GET_CONTACT_SUCCESS:
            return Object.assign({},state,{loading:true,address:action.payload.address,tel:action.payload.tel,fax:action.payload.fax,email:action.payload.email,contactUrl:action.payload.contactUrl});
        case GET_CONTACT_FAIL:
            return Object.assign({},state,{login:false});
        case GET_LINK_SUCCESS:
            return Object.assign({},state,{loading:true,link:action.payload});
        case GET_LINK_FAIL:
            return Object.assign({},state,{login:false});
        default:
            return state;
    }
}