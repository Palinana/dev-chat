/**
 * ACTION TYPES
 */
const SET_USER = 'SET_USER';
const CLEAR_USER = 'CLEAR_USER';

/**
 * ACTION CREATORS
 */

const settingUser = user => ({type: SET_USER, user});
const clearingUser = () => ({type: CLEAR_USER});

/**
 * THUNK CREATORS
 */
export const setUser = user => async dispatch => {
    try {
        dispatch(settingUser(user))
    } catch (err) {
        console.error(err)
    }
}

export const clearUser = user => async dispatch => {
  try {
      dispatch(clearingUser(user))
  } catch (err) {
      console.error(err)
  }
}

/**
 * INITIAL STATE
 */
const initialUserState = {
    user: null,
    isLoading: true
}

export default function(state = initialUserState, action){
    switch (action.type) {
        case SET_USER:
            return {
              ...action.user,
              isLoading: false
            }
        case CLEAR_USER:
            return {
              initialUserState,
              isLoading: false
            }
        default:
            return state
    }
}