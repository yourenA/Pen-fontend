import { combineReducers } from 'redux';
import record from './record';

//注册reducer，每个自定义的reducer都要来这里注册！！！不注册会报错。
const rootReducer = combineReducers({
  /* your reducers */
  record,
});

export default rootReducer;
