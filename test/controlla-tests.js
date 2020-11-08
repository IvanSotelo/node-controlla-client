/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
import ControllaApi from '../src/controlla'

function getOptions (options) {
  const actualOptions = options || {}
  return {
    protocol: actualOptions.protocol || 'http',
    host: actualOptions.host || 'controlla.somehost.com',
    port: actualOptions.port || '8080',
    username: actualOptions.username || 'someusername',
    password: actualOptions.password || 'somepassword',
    apiVersion: actualOptions.apiVersion || '2.0',
    base: actualOptions.base || '',
    strictSSL: actualOptions.hasOwnProperty('strictSSL') ? actualOptions.strictSSL : true,
    request: actualOptions.request,
    oauth: actualOptions.oauth || null,
    intermediatePath: actualOptions.intermediatePath,
    bearer: actualOptions.bearer || null,
    ca: actualOptions.ca || null
  }
}

describe('Controlla API Tests', () => {
  describe('Constructor Tests', () => {
    it('Constructor functions properly', () => {
      const controlla = new ControllaApi(getOptions())

      expect(controlla.protocol).to.eql('http')
      expect(controlla.host).to.eql('controlla.somehost.com')
      expect(controlla.port).to.eql('8080')
      expect(controlla.baseOptions.auth.user).to.eql('someusername')
      expect(controlla.baseOptions.auth.pass).to.eql('somepassword')
      expect(controlla.apiVersion).to.eql('2.0')
    })

    it('Constructor with no auth credentials', () => {
      const { username, password, ...options } = getOptions()

      expect(options.username).to.not.eql(username)
      expect(options.password).to.not.eql(password)

      const controlla = new ControllaApi(options)

      expect(controlla.baseOptions.auth).to.be.undefined
    })

    it('Constructor with bearer credentials', () => {
      const options = getOptions({
        bearer: 'testBearer'
      })

      const controlla = new ControllaApi(options)

      expect(controlla.baseOptions.auth).to.eql({
        user: '',
        pass: '',
        sendImmediately: true,
        bearer: options.bearer
      })
    })

    it('Constructor with oauth credentials', () => {
      const options = getOptions({
        oauth: {
          consumer_key: 'consumer',
          consumer_secret: 'consumer_secret',
          access_token: 'token',
          access_token_secret: 'token_secret'
        }
      })

      const controlla = new ControllaApi(options)

      expect(controlla.baseOptions.oauth).to.eql({
        consumer_key: 'consumer',
        consumer_secret: 'consumer_secret',
        token: 'token',
        token_secret: 'token_secret',
        signature_method: 'RSA-SHA1'
      })
    })

    it('Constructor with timeout', () => {
      const controlla = new ControllaApi({
        timeout: 2,
        ...getOptions()
      })

      expect(controlla.baseOptions.timeout).to.equal(2)
    })

    it('Constructor with strictSSL off', () => {
      const controlla = new ControllaApi(
        getOptions({
          strictSSL: false
        })
      )

      expect(controlla.strictSSL).to.equal(false)
    })
  })
})
