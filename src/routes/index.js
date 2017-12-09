import HomePage from '../containers/HomePage/routes'

export const createRoutes = (store) => ({
  path: '/',
  indexRoute: {
    onEnter (nextState, replace) {
      replace(`/home`);
    }
  },
  childRoutes: [
    ...HomePage(store),
  ]
})

export default createRoutes
