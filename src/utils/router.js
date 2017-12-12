import { browserHistory } from 'react-router'
// const browserHistory = hashHistory

const push = (url) => {
	browserHistory.push(url)
}

const goBack = (step) => {
  browserHistory.goBack(step);
}

const replace = (url) => {
	browserHistory.replace(url)
}

const Navigator = {
	push,
	goBack,
	replace,
};

export default Navigator;

