import createReducer from 'store/creatReducer'
import {
  GET_INFO
} from './constants'

export const initialState = {
  projectInfo: ''
}

const actionHandler = {

  [GET_INFO]: (state, action) => {
    const { projectInfo } = action.data

    return { projectInfo }
  }
}

export default createReducer(initialState, actionHandler)
