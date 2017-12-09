import {
  GET_INFO
} from './constants'

export function getProjectInfo (params) {
  return dispatch => {
    dispatch({
      type: GET_INFO,
      data: { projectInfo: 'react-project'}
    })
  }
}
