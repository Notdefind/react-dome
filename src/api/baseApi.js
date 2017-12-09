/* @flow */

import { ErrorMessages  } from '../constants';
import platform from '../config/platform';
import * as _ from 'utils/lang';
import 'whatwg-fetch';

const fetch = window.fetch;

/*
  统一数据处理需完成的几个需求
  1: 发送出去的请求能取消
  2: 同时发送多个操作数据请求时，能提供优先级
  3: 提供获取返回结果之后对结果进行拦截处理
  4: 希望统一 ajax & webscoket 操作数据接口的方式，
  5: 发送出去的请求能附带设备代理信息
  6: 所有接口操作数据出现网络异常或程序错误提供统一机制处理
  7: 支持特定返回状态码撞拦截处理
*/


// Number each API request (used for debugging)
let requestCounter = 0;


/* Helper Functions ==================================================================== */
/**
  * Debug or not to debug
  */
function debug(str, title) {
  if (platform.enableDebug && (title || str)) {
    if (title) {
      console.log(`=== DEBUG: ${title} ===========================`);
    }
    if (str) {
      console.log(str);
      console.log('%c ...', 'color: #CCC');
    }
  }
}


/**
  * Sends requests to the API
  */
function handleError(err) {
  let error = '';
  if (typeof err === 'string') error = err;
  else if (err && err.message) error = err.message;

  if (!error) error = ErrorMessages.default;
  return error;
}


/**
  * Convert param object into query string
  * eg.
  *   {foo: 'hi there', bar: { blah: 123, quux: [1, 2, 3] }}
  *   foo=hi there&bar[blah]=123&bar[quux][0]=1&bar[quux][1]=2&bar[quux][2]=3
  */
function serialize(obj, prefix) {
  const str = [];

  Object.keys(obj).forEach((p) => {
    const k = prefix ? `${prefix}[${p}]` : p;
    const v = obj[p];

    str.push((v !== null && typeof v === 'object') ?
      serialize(v, k) :
      `${encodeURIComponent(k)}=${encodeURIComponent(v)}`);
  });

  return str.join('&');
}


export default class BaseRestful {
  _actions: any = {};
  _baseUrl: string;
  _methods = ['get', 'post', 'put', 'patch', 'options', 'head', 'delete'];

  constructor() {
    this._actions = this.requestActions();
    this._processActions();
  }

  requestActions() {
  }

  requestInterceptor(req) {
    return req;
  }

  responseInterceptor(res) {
    return res;
  }

  get baseUrl() {
    return this._baseUrl;
  }

  set baseUrl(val) {
    this._baseUrl = val;
  }

  /**
    * request method type normalize
    * @params
    * params:          string | array | object  ==> 'get' | ['get', 'post'] | { type: 'get'}. { type: ['get', 'post']}
    */
  _normalizeMethods(params) {
    let methods = ['get', 'post', 'put', 'patch', 'delete'];

    if (_.isString(params)) {
      methods = [params];
    } else if (_.isArray(params)) {
      methods = params;
    } else if (_.isObject(params) && params.type) {
      if (_.isString(params.type)) {
        methods = [params.type];
      } else if (_.isArray(item.type)) {
        methods = params.type;
      }
    }

    return methods;
  }

  /**
    * 解析 actions 列表， 创建对象的 GET, POST, PUT, PATCH, DELETE, HEADE, OPTIONS 调用函数
    * @params
    */
  _processActions() {
    this._actions.forEach((item) => {
      const action = item[0];     // methodName;
      const endpoint = item[1];   // endpoint;
      const extension = item[2];  // type or extension params

      if (item.length < 2 && item.length > 3) {
        debug('method define', 'method define error');
        return;
      }

      const methods = this._normalizeMethods(extension, item.length);
      let descriptor = this._defineMethods(this, action, {}, methods, endpoint);
      Object.defineProperty(this, action, { value: descriptor });
    });

    return this;
  }

  /**
    * Sends requests to the API
    * @params
    * method:           string 方法类型[GET, POST, PUT, DELETE, PATCH]
    * inputEndpoint:    string url
    * inputParams:      string | number | object, url地址后拼接参数
    * body:             object http post 类型主体参数
    */
  makeRequest(method, inputEndpoint, inputParams, body, headers) {
    let endpoint = inputEndpoint;
    let params = inputParams;

    return new Promise(async (resolve, reject) => {
      requestCounter += 1;
      const requestNum = requestCounter;

      // After x seconds, let's call it a day!
      const timeoutAfter = 7;
      const apiTimedOut = setTimeout(() => (
        reject(ErrorMessages.timeout)
      ), timeoutAfter * 1000);

      if (!method || !endpoint) return reject('Missing params (AppAPI.fetcher).');
  
      if (method === 'post') {
  
        body = { ...body };
      } else if(method === 'get') {
        params = { ...inputParams };
      }

      // Build request
      const req = {
        method: method.toUpperCase(),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'User-Agent': navigator.userAgent,
          ...(headers || {}),
        },
      };


      // Add Endpoint Params
      let urlParams = '';
      if (params) {
        // Object - eg. /recipes?title=this&cat=2
        if (typeof params === 'object') {
          // Replace matching params in API routes eg. /recipes/{param}/foo
          Object.keys(params).forEach((param) => {
            if (endpoint.includes(`{${param}}`)) {
              endpoint = endpoint.split(`{${param}}`).join(params[param]);
              delete params[param];
            }
          });


          // Add the rest of the params as a query string
          urlParams = `?${serialize(params)}`;

        // String or Number - eg. /recipes/23
        } else if (typeof params === 'string' || typeof params === 'number') {
          urlParams = `/${params}`;

        // Something else? Just log an error
        } else {
          debug('You provided params, but it wasn\'t an object!', platform.serverURL + endpoint + urlParams);
        }
      }

      // Add Body
      if (body) req.body = JSON.stringify(body);

      let thisUrl;
      if (endpoint.indexOf('http') > -1) {
        thisUrl = endpoint + urlParams;
      } else {
        thisUrl = platform.serverURL + endpoint + urlParams;
      }

      debug('', `API Request #${requestNum} to ${thisUrl}`);

      // Make the request
      return fetch(thisUrl, req)
        .then(async (rawRes) => {
          // API got back to us, clear the timeout
          clearTimeout(apiTimedOut);

          let jsonRes = {};

          try {
            jsonRes = await rawRes.json();
          } catch (error) {
            const err = { message: ErrorMessages.invalidJson };
            throw err;
          }

          // Only continue if the header is successful
          if (rawRes && rawRes.status === 200) { return jsonRes; }
          throw jsonRes;
        })
        .then((res) => {
          debug(res, `API Response #${requestNum} from ${thisUrl}`);
          return resolve(res);
        })
        .catch((err) => {
          // API got back to us, clear the timeout
          clearTimeout(apiTimedOut);

          debug(err, platform.serverURL + endpoint + urlParams);
          return reject(err);
        });
    });
  }

  _defineMethods(target, propertyKey, descriptor, methods, endpoint) {
    const _context = this;
    const _methods = methods;

    _methods.forEach(( methodName) => {
      const name = methodName.toLowerCase();
      const fun = this._defineMethod(descriptor, name, {}, endpoint);
      Object.defineProperty(descriptor, name, fun);
    });
    return descriptor;
  }

  _defineMethod(target, propertyKey, descriptor, endpoint) {
    const _context = this;
    descriptor.value = (params, payload, headers) => _context.makeRequest(propertyKey, endpoint, params, payload, headers);
    return descriptor;
  }
}
