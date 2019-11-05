/**
 * ACTION TYPES
 */
const SET_CURRENT_CHANNEL = 'SET_CURRENT_CHANNEL';
const SET_PRIVATE_CHANNEL = 'SET_PRIVATE_CHANNEL';
/**
 * ACTION CREATORS
 */

const settingChannel = channel => ({type: SET_CURRENT_CHANNEL, channel});
const settingPrivateChannel = isPrivate => ({type: SET_PRIVATE_CHANNEL, isPrivate});
/**
 * THUNK CREATORS
 */
export const setCurrentChannel = channel => async dispatch => {
    try {
        dispatch(settingChannel(channel))
    } catch (err) {
        console.error(err)
    }
}

export const setPrivateChannel = channel => async dispatch => {
    try {
        dispatch(settingPrivateChannel(channel))
    } catch (err) {
        console.error(err)
    }
}

/**
 * INITIAL STATE
 */
const initialChannelState = {
    currentChannel: null,
    isPrivateChannel: false
}


export default function(state = initialChannelState, action){
    switch (action.type) {
        case SET_CURRENT_CHANNEL:
            return {
                ...state,
                currentChannel: action.channel
            };
        case SET_PRIVATE_CHANNEL:
            return {
                ...state,
                isPrivateChannel: action.isPrivate
            };
        default:
            return state
    }
}
