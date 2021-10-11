import { applyMiddleware, createStore } from "redux";
import rootReducer from "./reducer";
import thunk from "redux-thunk";
const inintialState = {};
// const middleware = [thunk];
const store = createStore(rootReducer, inintialState, applyMiddleware(thunk));

export default store;
