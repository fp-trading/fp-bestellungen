const webdriver = require('selenium-webdriver')
const chrome = require('selenium-webdriver/chrome')
const appRootDir = require('app-root-dir')

const chromedriverPath = appRootDir.get() + '/public/bin/chromedriver'
const chromePath = appRootDir.get() + '/public/bin/Google Chrome.app/Contents/MacOS/Google Chrome'
const options = new chrome.Options().setChromeBinaryPath(chromePath)
const service = new chrome.ServiceBuilder(chromedriverPath)

module.exports = {
    OrderFulfiller: class {
        driver

        constructor() {
            this.instanciateDriver()
        }

        instanciateDriver() {
            this.driver = new webdriver.Builder()
                .setChromeService(service)
                .setChromeOptions(options)
                .forBrowser('chrome')
                .build()
        }

        async fulfill(address, products, credentials) {
            try {
                await this.login(credentials)
                this.fulfillProducts(products)
                this.enterAddress(address)
            } catch (err) {
                if (err.name === 'NoSuchWindowError') {
                    this.instanciateDriver()
                    await this.fulfill(address, products, credentials)
                }
            }
        }

        async login(credentials) {
            await this.driver.get('https://sto.de/s/login')
            const acceptButton = this.driver.wait()
        }

        async fulfillProducts(products) {
            products.forEach(product => this.fulfillProduct(product))
        }

        async fulfillProduct(product) {
            console.log(product)
        }

        async enterAddress(address) {
            console.log(address)
        }
    }
}