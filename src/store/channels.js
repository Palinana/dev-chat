/**
 * ACTION TYPES
 */
const SET_CURRENT_CHANNEL = 'SET_CURRENT_CHANNEL';

/**
 * ACTION CREATORS
 */

const settingChannel = channel => ({type: SET_CURRENT_CHANNEL, channel});

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

/**
 * INITIAL STATE
 */
const initialChannelState = {
    currentChannel: null,
}


export default function(state = initialChannelState, action){
    switch (action.type) {
        case SET_CURRENT_CHANNEL:
            return {
              ...action.channel
            }
        default:
            return state
    }
}
