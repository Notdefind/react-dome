import BaseApi from './baseApi';

class home extends BaseApi {

  requestActions() {
    return [
      ['fetchInfo', 'homeInfo', 'GET']
    ];
  }
}

export default new home;
