const link = 'https://api.exchangeratesapi.io/latest?base=USD'
const currencyNameList = new Map([
	['IDR',"Indonesian Rupiah"],
	['HKD',"Hong Kong Dollar"],
	['CAD',"Canadian Dollar"],
	['ISK',"Iceland Krona"],
	['PHP',"Philippine Peso"],
	['DKK',"Danish Krone"],
	['HUF',"Hungary Forint"],
	['CZK',"Czech Koruna"],
	['GBP',"Pound Sterling"],
	['RON',"Romanian Leu"],
	['SEK',"Swedish Krona"],
	['INR',"Indian Rupee"],
	['BRL',"Brazilian Real"],
	['RUB',"Russian Ruble"],
	['HRK',"Croatia Kuna"],
	['JPY',"Japanese Yen"],
	['THB',"Thailand Baht"],
	['CHF',"Swiss Franc"],
	['EUR',"Euro"],
	['MYR',"Malaysian Ringgit"],
	['BGN',"Bulgarian Lev"],
	['TRY',"Turkish Lira"],
	['CNY',"Chinese Yuan Renminbi"],
	['NOK',"Norwegian Krone"],
	['NZD',"New Zealand Dollar"],
	['ZAR',"Rand"],
	['MXN',"Mexican Peso"],
	['SGD',"Singapore Dollar"],
	['AUD',"Australian Dollar"],
	['ILS',"New Israeli Sheqel"],
	['KRW',"Korean Won"],
	['PLN',"Poland Zloty"]
])

function httpGet(url) {
	var xhr = new XMLHttpRequest()
	xhr.onreadystatechange = () => {}
	xhr.open("GET", link, false)
	xhr.send(null)
	return xhr.responseText
}

class Model {
	constructor() {
		const obj = JSON.parse(httpGet(link))
		const rates = obj.rates
		this.currencyList = [
			{id:1, code:'IDR', name:currencyNameList.get('IDR'), rate:rates.IDR, amount:rates.IDR},
			{id:2, code:'EUR', name:currencyNameList.get('EUR'), rate:rates.EUR, amount:rates.EUR},
			{id:3, code:'GBP', name:currencyNameList.get('GBP'), rate:rates.GBP, amount:rates.GBP},
			{id:4, code:'SGD', name:currencyNameList.get('SGD'), rate:rates.SGD, amount:rates.SGD},
		]
	}

	bindCurrencyListChanged(callback) {
		this.onCurrencyListChanged = callback
	}
	
	addCurrency(currencyInput, amountInput) {
		var rates = null
		const obj = JSON.parse(httpGet(link), (key, value) => {
			if(key == currencyInput) {
				rates = value
				return value
			}
		})
		if (rates != null) {
			const currency = {
				id: this.currencyList.length > 0 ? this.currencyList[this.currencyList.length - 1].id + 1 : 1,
				code: currencyInput,
				name: currencyNameList.get(currencyInput),
				rate: parseFloat(rates).toFixed(2),
				amount: parseFloat(rates).toFixed(2) * parseFloat(amountInput).toFixed(2),
			}
			this.currencyList.push(currency)
			this.onCurrencyListChanged(this.currencyList)
		} else {
			alert('Invalid Currency or Currency Not Supported !')
		}
	}
	
	deleteCurrency(id) {
		this.currencyList = this.currencyList.filter(currency => currency.id !== id)
		this.onCurrencyListChanged(this.currencyList)
	}

	editAmount(amountInput) {
		this.currencyList = this.currencyList.map(currency =>
			({ id: currency.id, code: currency.code, name: currency.name, rate: currency.rate, amount: parseFloat(currency.rate).toFixed(2) * parseFloat(amountInput).toFixed(2) })
		)
		this.onCurrencyListChanged(this.currencyList)
	}

}

class View {
	constructor() {
		this.app = this.getElement('#root')

		this.title = this.createElement('h1')
		this.title.textContent = 'Currency Converter'

		this.newLine = this.createElement('br')

		this.headerDiv = this.createElement('div')
		this.headerDiv.id = 'headerDiv'

		this.labelHeader = this.createElement('label')
		this.labelHeader.id = 'labelHeader'
		this.labelHeader.textContent = 'USD - United States Dollar'

		this.labelUSD = this.createElement('label')
		this.labelUSD.id = 'labelUSD'
		this.labelUSD.textContent = 'USD'

		this.inputAmount = this.createElement('input', 'inputAmount')
		this.inputAmount.id = 'inputAmount'
		this.inputAmount.type = 'number'
		this.inputAmount.placeholder = '0.00'
		this.inputAmount.value = '1.00'

		this.detailDiv = this.createElement('div')
		this.detailDiv.id = 'detailDiv'

		this.unorderedList = this.createElement('ul')
		this.unorderedList.id = 'unorderedList'

		this.buttonAdd = this.createElement('button', 'buttonAdd')
		this.buttonAdd.id = 'buttonAdd'
		this.buttonAdd.textContent = '(+) Add More Currency'

		this.form = this.createElement('form')
		this.form.style.display = 'none'

		this.inputCurrency = this.createElement('input', 'inputCurrency')
		this.inputCurrency.id = 'inputCurrency'
		this.inputCurrency.type = 'text'
		this.inputCurrency.placeholder = 'Input Currency..'

		this.buttonSubmit = this.createElement('button', 'buttonSubmit')
		this.buttonSubmit.id = 'buttonSubmit'
		this.buttonSubmit.textContent = 'Submit'

		this.form.append(this.inputCurrency, this.buttonSubmit)
		this.headerDiv.append(this.labelHeader, this.newLine, this.labelUSD, this.inputAmount)
		this.detailDiv.append(this.unorderedList)
		this.app.append(this.title, this.headerDiv, this.detailDiv)

		this.localListeners()
	}

	get amountInput() {
		return this.inputAmount.value
	}

	set amountInput(input) {
		return this.inputAmount.value = input
	}

	get currencyInput() {
		return this.inputCurrency.value
	}

	currencyReset() {
		return this.inputCurrency.value = ''
	}

	createElement(tag, className) {
		const element = document.createElement(tag)
		if (className) {
			element.classList.add(className)
		}
		return element
	}

	getElement(selector) {
		const element = document.querySelector(selector)
		return element
	}

	displayCurrencyList(currencyList) {
		while (this.unorderedList.firstChild) {
			this.unorderedList.removeChild(this.unorderedList.firstChild)
		}

		if (currencyList.length === 0) {
			const p = this.createElement('p')
			p.textContent = 'No Currency, Please add some'
			this.unorderedList.append(p)
		} else {
			currencyList.forEach(currency => {
				const listItem = this.createElement('li')
				listItem.id = currency.id

				const contentDiv = this.createElement('div', 'contentDiv')
				contentDiv.id = currency.id

				const buttonDelete = this.createElement('button', 'delete')
				buttonDelete.id = 'buttonDelete'
				buttonDelete.textContent = '(-)'

				const labelCurrencyCode = this.createElement('label')
				labelCurrencyCode.id = 'labelCurrencyCode'
				labelCurrencyCode.textContent = currency.code

				const labelEquivalentAmount = this.createElement('label')
				labelEquivalentAmount.id = 'labelEquivalentAmount'
				labelEquivalentAmount.textContent = parseFloat(currency.amount).toFixed(2)

				const labelCurrencyName = this.createElement('label')
				labelCurrencyName.id = 'labelCurrencyName'
				labelCurrencyName.textContent = currency.code + ' - ' + currency.name

				const labelRate = this.createElement('label')
				labelRate.id = 'labelRate'
				labelRate.textContent = 'USD 1 = ' + currency.code + ' ' + parseFloat(currency.rate).toFixed(2)

				const newLine1 = this.createElement('br')
				const newLine2 = this.createElement('br')

				contentDiv.append(buttonDelete, labelCurrencyCode, labelEquivalentAmount, newLine1, labelCurrencyName, newLine2, labelRate)
				listItem.append(contentDiv)
				this.unorderedList.append(listItem)
			})
		}
		const listItemButton = this.createElement('li')
		listItemButton.append(this.buttonAdd, this.form)
		this.unorderedList.append(listItemButton)
	}

	bindAddCurrency(handler) {
		this.buttonSubmit.addEventListener('click', event => {
			event.preventDefault()
			if (this.currencyInput) {
				handler(this.currencyInput.toUpperCase(), this.amountInput)
				this.currencyReset()
				this.form.style.display = 'none'
				this.buttonAdd.style.display = 'block'
			}
		})
	}

	bindDeleteCurrency(handler) {
		this.unorderedList.addEventListener('click', event => {
			if (event.target.className === 'delete') {
				const id = parseInt(event.target.parentElement.id)
				handler(id)
			}
		})
	}

	bindEditAmount(handler) {
		this.inputAmount.addEventListener('focusout', event => {
			if (this.amountInput) {
				handler(this.amountInput)
			}
		})
	}

	localListeners() {
		this.inputAmount.addEventListener('input', event => {
			if (event.target.className === 'inputAmount') {
				this.amountInput = this.amountInput
			}
		})

		this.buttonAdd.addEventListener('click', event => {
			if (event.target.className === 'buttonAdd') {
				this.form.style.display = 'block'
				this.buttonAdd.style.display = 'none'
			}
		})
	}
}

class Controller {
	constructor(model, view) {
		this.model = model
		this.view = view

		this.model.bindCurrencyListChanged(this.onCurrencyListChanged)

		this.view.bindAddCurrency(this.handleAddCurrency)
		this.view.bindDeleteCurrency(this.handleDeleteCurrency)
		this.view.bindEditAmount(this.handleEditAmount)

		this.onCurrencyListChanged(this.model.currencyList)
	}

	onCurrencyListChanged = currencyList => {
		this.view.displayCurrencyList(currencyList)
	}

	handleAddCurrency = (currencyInput, amountInput) => {
		this.model.addCurrency(currencyInput, amountInput)
	}

	handleDeleteCurrency = id => {
		this.model.deleteCurrency(id)
	}

	handleEditAmount = (amountInput) => {
		this.model.editAmount(amountInput)
	}

}

const app = new Controller(new Model, new View)