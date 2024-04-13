import { userIdAction, usernameAction } from "./actions";
import initialState from "./initialState";
import { stateType } from "./stateType";
import { configureStore } from "@reduxjs/toolkit";

const reducer = (state: stateType = initialState, action: {type: string, payload: string}) => {
    switch (action.type) {
        case userIdAction:
            return {...state, userID: action.payload};
        case usernameAction:
            return {...state, username: action.payload};
        default:
            return state;
    }
}

export default configureStore({reducer});

