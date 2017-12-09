import { connect } from 'react-redux';

import Home from './Home';
import {
  getProjectInfo
} from './redux/actions';


const mapStateToProps = state => {
  const { projectInfo } = state.HomePage.Home;

  return {
    projectInfo
  };
};

const mapDispatchToProps = {
  getProjectInfo
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
