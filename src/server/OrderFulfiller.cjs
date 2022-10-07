const webdriver = require('selenium-webdriver')
const chrome = require('selenium-webdriver/chrome')
const appRootDir = require('app-root-dir')
const { until, By } = require('selenium-webdriver')
const { Key } = require('selenium-webdriver')
const { default: e } = require('express')

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
                await this.ensureLogin(credentials);
                await this.fulfillProducts(products);
                await this.enterAddress(address);
                return { message: "success", status: 200 }
            } catch (err) {
                if (err.name === 'NoSuchWindowError') {
                    this.instanciateDriver()
                    await this.fulfill(address, products, credentials)
                } else {
                    err.status = 400
                    return err
                }
            }
        }

        async ensureLogin(credentials) {
            let accountLink = await this.driver.findElements(By.xpath('//*[@data-qa="action/header/viewMyAccountFlyout"]'));

            if (accountLink.length === 0) {
                await this.login(credentials);
            }
        }

        async fulfillProducts(products) {
            for (const product of products) {
                await this.fulfillProduct(product);
            }
        }

        async enterAddress(address) {
            console.log(address)
        }

        async login(credentials) {
            await this.driver.get('https://sto.de/s/login');
            await this.denyCookies();
            await this.enterLoginData(credentials);
            await this.sendLogin();
        }

        async denyCookies() {
            const acceptButton = await this.driver.wait(until.elementLocated(By.xpath('//button[@data-qa="cookie/accept"]')));
            await acceptButton.click();
        }

        async enterLoginData(credentials) {
            const usernameInput = await this.driver.wait(until.elementLocated(By.xpath('//input[@data-qa="input/login/username"]')));
            const passwordInput = await this.driver.wait(until.elementLocated(By.xpath('//input[@data-qa="input/login/password"]')));

            await usernameInput.sendKeys(credentials.username);
            await passwordInput.sendKeys(credentials.password);
        }

        async sendLogin() {
            const loginButton = await this.driver.wait(until.elementLocated(By.xpath('//button[@data-qa="action/login/submit"]')));
            await loginButton.click();
            await this.driver.wait(until.elementLocated(By.xpath('//*[@data-qa="action/header/viewMyAccountFlyout"]')));
        }

        async fulfillProduct(product) {
            await this.goToProduct(product.sku);
            await this.selectVariant(product.sku);
            await this.selectUnit();
            if (product.color !== "")
                await this.enterColor(product.color);
            await this.enterQuantity(product.quantity);
            await this.addToCart();
        }

        async goToProduct(sku) {
            await this.driver.get(`https://sto.de/s/search-results#q=${sku}&t=products`);
            await this.driver.wait(until.elementLocated(By.xpath('//a[@data-qa="section/searchResults/result"]'))).click();
            await this.driver.wait(until.elementLocated(By.xpath('//img[@data-qa="component/productDetails/image"]')));
        }

        async selectVariant(sku) {
            const articleSelectors = await this.getArticleSelectors();

            if (articleSelectors.articleOptions === undefined) {
                await this.handleNoArticleOptionsProduct(sku);
            } else {
                await this.handleArticleOptionsProduct(articleSelectors, sku);
            }
        }

        async getArticleSelectors() {
            let articleDropdown = await this.getArticleDropdown();
            let articleOptions = await this.getArticleOptions(articleDropdown);

            return { articleDropdown, articleOptions }
        }

        async getArticleDropdown() {
            try {
                return await this.driver.findElement(By.xpath('//*[@data-qa="section/productDetails/articleVariationSelection"]'));
            } catch (err) {
                return undefined;
            }
        }

        async getArticleOptions(articleDropdown) {
            if (articleDropdown) {
                await articleDropdown.click();
                const articleOptions = await this.driver.findElements(By.xpath('//*[@data-qa="section/productDetails/articleVariationSelection"]//ul/li'));
                if (articleOptions.length > 0) {
                    await articleOptions[0].click();
                    return articleOptions;
                }
            }

            return undefined;
        }

        async handleNoArticleOptionsProduct(sku) {
            const contentSelectors = await this.getContentSelectors();

            if (contentSelectors.contentOptions === undefined) {
                await this.handleNoOptions(sku);
            } else {
                if (!await this.tryToFindContentOption(contentSelectors, sku))
                    throw new Error("None of the content options match the sku!");
            }
        }

        async getContentSelectors() {
            let contentDropdown = await this.getContentDropdown();
            let contentOptions = await this.getContentOptions(contentDropdown);

            return { contentDropdown, contentOptions }
        }

        async getContentDropdown() {
            try {
                return await this.driver.findElement(By.xpath('//*[@data-qa="section/productDetails/contentPerContainerSelection"]'));
            } catch (err) {
                return undefined;
            }
        }

        async getContentOptions(contentDropdown) {
            if (contentDropdown) {
                await contentDropdown.click();
                const contentOptions = await this.driver.findElements(By.xpath('//*[@data-qa="section/productDetails/contentPerContainerSelection"]//ul/li'));
                if (contentOptions.length > 0) {
                    await contentOptions[0].click();
                    return contentOptions;
                }
            }

            return undefined;
        }

        async handleNoOptions(sku) {
            if (!await this.skuMatches(sku))
                throw new Error("Product has no options and sku doesn't match!")
        
            return
        }

        async tryToFindContentOption(contentSelectors, sku) {
            for (const contentOption of contentSelectors.contentOptions) {
                await this.clickOptionOfDropdown(contentOption, contentSelectors.contentDropdown);

                if (await this.skuMatches(sku))
                    return true
            }

            return false
        }

        async clickOptionOfDropdown(option, dropdown) {
            if (!await option.isDisplayed()) {
                await dropdown.click();
            }

            await option.click();
        }

        async handleArticleOptionsProduct(articleSelectors, sku) {
            for (const articleOption of articleSelectors.articleOptions) {
                await this.clickOptionOfDropdown(articleOption, articleSelectors.articleDropdown);

                const contentSelectors = await this.getContentSelectors();

                if (contentSelectors.contentOptions === undefined) {
                    if (await this.skuMatches(sku))
                        return;

                    continue;
                } else {
                    if (await this.tryToFindContentOption(contentSelectors, sku)) {
                        return;
                    } else {
                        continue;
                    }
                }
            }

            throw new Error("None of the options match the sku!")
        }

        async skuMatches(sku) {
            const currentSku = await this.driver.findElement(By.xpath('//span[@data-qa="section/productDetails/sku"]')).getText();
            return currentSku === sku;
        }

        async selectUnit() {
            const unitSelectors = await this.getUnitSelectors();

            if (unitSelectors.unitOptions === undefined)
                return

            const unit = await this.getUnit();

            for (const unitOption of unitSelectors.unitOptions) {
                const unitText = (await unitOption.getText()).toLocaleLowerCase();

                if (unit.includes(unitText) || unitText.includes('stück')) {
                    await this.clickOptionOfDropdown(unitOption, unitSelectors.unitDropdown);
                    break;
                }
            }
        }

        async getUnitSelectors() {
            let unitDropdown = await this.getUnitDropdown();
            let unitOptions = await this.getUnitOptions(unitDropdown);

            return { unitDropdown, unitOptions };
        }

        async getUnitDropdown() {
            try {
                return await this.driver.findElement(By.xpath('//*[@data-qa="component/productDetails/unitSelection"]'));
            } catch (err) {
                return undefined;
            }
        }

        async getUnitOptions(unitDropdown) {
            if (unitDropdown) {
                await unitDropdown.click();
                const unitOptions = await this.driver.findElements(By.xpath('//*[@data-qa="component/productDetails/unitSelection"]//ul/li'));
                if (unitOptions.length > 0) {
                    return unitOptions;
                }
            }

            return undefined;
        }

        async getUnit() {
            let unit = await this.driver.findElement(By.xpath('//*[contains(@data-qa, "section/productDetails/contentPerContainer")]')).getText()
        
            unit = unit.split('/')[0]
        
            unit = unit.split(' ')[unit.split(' ').length - 1]
        
            return unit.toLocaleLowerCase()
        }

        async enterColor(color) {
            const colorPicker = await this.driver.findElement(By.xpath('//*[@data-qa="section/productDetails/colorSelection"]//input'));

            await colorPicker.sendKeys(color)

            await this.driver.wait(until.elementLocated(By.xpath('//*[@data-qa="section/productDetails/colorSelection"]//ul/li')))

            colorPicker.sendKeys(Key.ARROW_DOWN);
            colorPicker.sendKeys(Key.ENTER);
        }

        async enterQuantity(quantity) {
            const quantityInput = await this.driver.wait(until.elementLocated(By.xpath('//*[@data-qa="input/productDetails/quantity"]//input')));

            await quantityInput.sendKeys(Key.BACK_SPACE);

            await quantityInput.sendKeys(quantity);
        }
        
        async addToCart() {
            await this.driver.wait(until.elementLocated(By.xpath('//button[@data-qa="action/productDetails/addToCart"]'))).click();
        }
    }
}

