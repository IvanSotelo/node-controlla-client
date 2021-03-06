import request from 'request-promise'
import url from 'url'

/**
 * @name ControllaApi
 * @class
 * Wrapper for the Controlla Rest Api
 */
export default class ControllaApi {
  /**
   * @constructor
   * @function
   * @param {ControllaApiOptions} options
   */
  constructor (options) {
    this.protocol = options.protocol || 'http'
    this.host = options.host
    this.port = options.port || null
    this.apiVersion = options.apiVersion || '2'
    this.base = options.base || ''
    this.intermediatePath = options.intermediatePath
    this.strictSSL = options.hasOwnProperty('strictSSL') ? options.strictSSL : true
    // This is so we can fake during unit tests
    this.request = options.request || request
    // this.webhookVersion = options.webHookVersion || '1.0'
    // this.greenhopperVersion = options.greenhopperVersion || '1.0'
    this.baseOptions = {}

    if (options.oauth && options.oauth.consumer_key && options.oauth.access_token) {
      this.baseOptions.oauth = {
        consumer_key: options.oauth.consumer_key,
        consumer_secret: options.oauth.consumer_secret,
        token: options.oauth.access_token,
        token_secret: options.oauth.access_token_secret,
        signature_method: options.oauth.signature_method || 'RSA-SHA1'
      }
    } else if (options.bearer) {
      this.baseOptions.auth = {
        user: '',
        pass: '',
        sendImmediately: true,
        bearer: options.bearer
      }
    } else if (options.username && options.password) {
      this.baseOptions.auth = {
        user: options.username,
        pass: options.password
      }
    }

    if (options.timeout) {
      this.baseOptions.timeout = options.timeout
    }
  }

  /**
   * @typedef ControllaApiOptions
   * @type {object}
   * @property {string} [protocol=http] - What protocol to use to connect to
   * controlla? Ex: http|https
   * @property {string} host - What host is this tool connecting to for the controlla
   * instance? Ex: controlla.somehost.com
   * @property {string} [port] - What port is this tool connecting to controlla with? Only needed for
   * none standard ports. Ex: 8080, 3000, etc
   * @property {string} [username] - Specify a username for this tool to authenticate all
   * requests with.
   * @property {string} [password] - Specify a password for this tool to authenticate all
   * requests with. Cloud users need to generate an [API token](https://confluence.atlassian.com/cloud/api-tokens-938839638.html) for this value.
   * @property {string} [apiVersion=2] - What version of the controlla rest api is the instance the
   * tool is connecting to?
   * @property {string} [base] - What other url parts exist, if any, before the rest/api/
   * section?
   * @property {string} [intermediatePath] - If specified, overwrites the default rest/api/version
   * section of the uri
   * @property {boolean} [strictSSL=true] - Does this tool require each request to be
   * authenticated?  Defaults to true.
   * @property {function} [request] - What method does this tool use to make its requests?
   * Defaults to request from request-promise
   * @property {number} [timeout] - Integer containing the number of milliseconds to wait for a
   * server to send response headers (and start the response body) before aborting the request. Note
   * that if the underlying TCP connection cannot be established, the OS-wide TCP connection timeout
   * will overrule the timeout option ([the default in Linux can be anywhere from 20-120 *
   * seconds](http://www.sekuda.com/overriding_the_default_linux_kernel_20_second_tcp_socket_connect_timeout)).
   * @property {OAuth} [oauth] - Specify an OAuth object for this tool to authenticate all requests
   * using OAuth.
   * @property {string} [bearer] - Specify an OAuth bearer token to authenticate all requests with.
   */

  /**
   * @typedef OAuth
   * @type {object}
   * @property {string} consumer_key - The consumer entered in Controlla Preferences.
   * @property {string} consumer_secret - The private RSA file.
   * @property {string} access_token - The generated access token.
   * @property {string} access_token_secret - The generated access toke secret.
   * @property {string} signature_method [signature_method=RSA-SHA1] - OAuth signurate methode
   * Possible values RSA-SHA1, HMAC-SHA1, PLAINTEXT. Controlla Cloud supports only RSA-SHA1.
   */

  /**
   *  @typedef {object} UriOptions
   *  @property {string} pathname - The url after the specific functions path
   *  @property {object} [query] - An object of all query parameters
   *  @property {string} [intermediatePath] - Overwrites with specified path
   */

  /**
   * @name makeRequestHeader
   * @function
   * Creates a requestOptions object based on the default template for one
   * @param {string} uri
   * @param {object} [options] - an object containing fields and formatting how the
   */
  makeRequestHeader (uri, options = {}) {
    return {
      rejectUnauthorized: this.strictSSL,
      method: options.method || 'GET',
      uri,
      json: true,
      ...options
    }
  }

  /**
   * @typedef makeRequestHeaderOptions
   * @type {object}
   * @property {string} [method] - HTTP Request Method. ie GET, POST, PUT, DELETE
   */

  /**
   * @name makeUri
   * @function
   * Creates a URI object for a given pathname
   * @param {object} [options] - an object containing path information
   */
  makeUri ({
    pathname, query, intermediatePath, encode = false
  }) {
    const intermediateToUse = this.intermediatePath || intermediatePath
    const tempPath = intermediateToUse || `/rest/api/${this.apiVersion}`
    const uri = url.format({
      protocol: this.protocol,
      hostname: this.host,
      port: this.port,
      pathname: `${this.base}${tempPath}${pathname}`,
      query
    })
    return encode ? encodeURI(uri) : decodeURIComponent(uri)
  }

  /**
   * @typedef makeUriOptions
   * @type {object}
   * @property {string} pathname - The url after the /rest/api/version
   * @property {object} query - a query object
   * @property {string} intermediatePath - If specified will overwrite the /rest/api/version section
   */

  /**
   * @name makeWebhookUri
   * @function
   * Creates a URI object for a given pathName
   * @param {object} [options] - An options object specifying uri information
   */
  makeWebhookUri ({ pathname, intermediatePath }) {
    const intermediateToUse = this.intermediatePath || intermediatePath
    const tempPath = intermediateToUse || `/rest/webhooks/${this.webhookVersion}`
    const uri = url.format({
      protocol: this.protocol,
      hostname: this.host,
      port: this.port,
      pathname: `${this.base}${tempPath}${pathname}`
    })
    return decodeURIComponent(uri)
  }

  /**
   * @typedef makeWebhookUriOptions
   * @type {object}
   * @property {string} pathname - The url after the /rest/webhooks
   * @property {string} intermediatePath - If specified will overwrite the /rest/webhooks section
   */

  /**
   * @name doRequest
   * @function
   * Does a request based on the requestOptions object
   * @param {object} requestOptions - fields on this object get posted as a request header for
   * requests to controlla
   */
  async doRequest (requestOptions) {
    const options = {
      ...this.baseOptions,
      ...requestOptions
    }

    const response = await this.request(options)

    if (response) {
      if (Array.isArray(response.errorMessages) && response.errorMessages.length > 0) {
        throw new Error(response.errorMessages.join(', '))
      }
    }

    return response
  }

  /** Generic Get Request
   * [Jira Doc](https://docs.atlassian.com/jira-software/REST/cloud/2/)
   * @name genericGet
   * @function
   * @param {string} endpoint - Rest API endpoint
   */
  genericGet (endpoint) {
    return this.doRequest(this.makeRequestHeader(this.makeUri({
      pathname: `/${endpoint}`
    })))
  }
}
