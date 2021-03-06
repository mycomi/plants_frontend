import { USERS_DATA_STATE_CHANGE, USERS_POSTS_STATE_CHANGE, CLEAR_DATA } from "../constants"


const initialState = {
    users: [],
    home: [],
    usersFriendLoaded: 0,
}

export const users = (state = initialState, action) => {
    switch (action.type) {
        case USERS_DATA_STATE_CHANGE:
            return {
                ...state,
                users: [...state.users, action.user ]
            }
        case USERS_POSTS_STATE_CHANGE:
            return {
                ...state,
                usersFriendLoaded: state.usersFriendLoaded + 1,
                home: [...state.home, ...action.posts]
            }
        case CLEAR_DATA:
            return initialState

        default:
            return state;
    }
}