class CalcController{
    constructor(){
        this._locale = 'pt-BR'
        this._displayCalc = document.querySelector('#display')
        this._dateEl = document.querySelector('#data')
        this._timeEl = document.querySelector('#hora')
        this._currentDate
        this._operation = []
        this._lastOperator = ''
        this._result =0
        this._lastNumber
        this.initialize()
        this.initButtonsEvents()
        this.initKeybodard()
    }

    copyToClipboard(){
        let input = document.createElement('input')
        input.value = this.displayCalc
        document.body.appendChild(input)
        input.select()
        document.execCommand("Copy")
        input.remove()

    }

    pasteFromClipboard(){
        document.addEventListener('paste', e => {
            let text = e.clipboardData.getData('Text')
            this.displayCalc = parseFloat(text)
        })
    }

    initialize(){

        this.setDisplayDateTime()

        let interval = setInterval(() => {
           this.setDisplayDateTime()
        }, 1000)
        
        this.setLastNumberToDisplay()
        this.pasteFromClipboard()
    }

    initKeybodard(){
        document.addEventListener('keyup', e => {
            
            switch(e.key){
                case 'Escape':
                    this.clearAll()
                break
                case 'Backspace':
                    this.clearEntry()
                break
                case '+':
                case '-':
                case '*':
                case '/':
                case '%':
                    this.addOperation(e.key)
                break
                case 'Enter':
                case '=':
                    this.equalOperation('=')
                break
                case '.':
                case ',':
                    this.addDot()
                    break
                    case '0':
                    case '1':
                    case '2':
                    case '3':
                    case '4':
                    case '5':
                    case '6':
                    case '7':
                    case '8':
                    case '9':
                        this.addOperation(parseInt(e.key))
                break
                case 'c':
                    if(e.ctrlKey)
                        this.copyToClipboard()
                break
                
            }
        })
    }

    initButtonsEvents(){
        let buttons = document.querySelectorAll('#buttons > g, #parts > g')
        buttons.forEach(btn => {
            this.addMyEvent(btn, 'click drag', e => {
                let textBtn = btn.className.baseVal.replace('btn-','')
                this.execBtn(textBtn)
            })
            this.addMyEvent(btn, 'mouseover mouseup mousedown', e => {
                btn.style.cursor = 'pointer'
            })
        })
       
    }


    addMyEvent(element, events, fn){
        events.split(' ').forEach(event => {
            element.addEventListener(event, fn, false)
        })
       
    }

    getLastOperation(){
        if(this._operation.length == 0)
            this._operation[0] = 0
        return this._operation[this._operation.length-1]
    }

    setLastOperation(value){
        this._operation[this._operation.length-1] = value
    }

    execBtn(textBtn){
        switch(textBtn){
            case 'ac':
                this.clearAll()
            break
            case 'ce':
                this.clearEntry()
            break
            case 'soma':
                this.addOperation('+')
            break
            case 'subtracao':
                this.addOperation('-')
            break
            case 'divisao':
                this.addOperation('/')
            break
            case 'multiplicacao':
                this.addOperation('*')
            break
            case 'porcento':
                this.addOperation('%')
            break
            case 'igual':
                this.equalOperation('=')
            break
            case 'ponto':
                this.addDot('.')
            break
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                this.addOperation(parseInt(textBtn))
            break

            default:
                this.setError()
            break
        
        }
    }

    clearAll(){
        this._operation = []
        this._result = 0
        this.setLastNumberToDisplay()
    }
    clearEntry(){
        this._operation.pop()
        this.setLastNumberToDisplay()
    }
    isOperator(value){
        let operators = ['+', '-', '*', '/']
        return operators.indexOf(value)>-1
    }
    isEqualOrPercent(value){
        let equalOrPercent = ['=', '%']
        return equalOrPercent.indexOf(value) > -1
    }
    equalOperation(value){
        if(this._result == 0)
            this.pushOperation(value)
        else if(this.getLastOperation() == '='){
            console.log('agora vai ' + this._lastOperator)
            this._result = eval(this._result.toString() + this._lastOperator + this._lastNumber.toString())
            //this.calculate()
            console.log(this._result)
        }
        else{
            this.pushOperation(value)
            // this._result = eval(this._result.toString() + op + num)
        }
    }
    addDot(value){
        let lastOperation = this.getLastOperation().toString()
        if(lastOperation.indexOf('.') > -1)
            return
        if(lastOperation == 0)
            this.setLastOperation('0.')
        else if(this.isOperator(lastOperation))
            this.pushOperation('0.')
        else 
            this.setLastOperation(lastOperation.toString() + '.')
        this.setLastNumberToDisplay()
    }
    pushOperation(value){
        this._operation.push(value)
        console.log(this._operation)
        if(this._operation.length > 3){
            this.calculate()
        }
    }
    getResult(){
        this._lastNumber = this.getLastOperation()
        // console.log('ult op ', this._lastOperator)
        // console.log('ult num ', this._lastNumber)
        try{
            return eval(this._operation.join(''))
        }catch(e){
            this.setError()
        }
        
    }

    calculate(){
        let last = this._operation.pop()
        console.log('ultimo ->  ' + last)
        if(this.isOperator(last)){
            this._lastOperator = last
            this._result = this.getResult()
            this._operation = [this._result, last]
        }
        else if(last == '%'){
            this._result /= 100
            this._operation = [this._result]
        }
        else {
            this._result = this.getResult()
            this._operation = [this._result, last]
            console.log(this._operation)
        }
        this.setLastNumberToDisplay()

    }

    setLastNumberToDisplay(){
        let lastNumber
        for(let i = this._operation.length-1; i >= 0; i--){
            if(!this.isOperator(this._operation[i]) && !this.isEqualOrPercent(this._operation[i])){
                lastNumber = this._operation[i]
                //console.log(lastNumber)
                break
            }
        }
        if(!lastNumber)
            lastNumber = 0
        this.displayCalc = lastNumber
        
    }

    addOperation(value){
        if(this.isOperator(value)){                 // digitaram um operador?
            this._lastOperator = value
            if(!isNaN(this.getLastOperation()))     // utlima posicao do array é um número?
                this.pushOperation(value)           // entao add o novo operador no array e se for o caso já calcula o resultado
            else
                this.setLastOperation(value)        // entao troca o operador do array pra este novo
        }
        else if(value == '%'){
            this.pushOperation(value)
        }
        else{
            if(isNaN(this.getLastOperation()))
                this.pushOperation(0)
            let newValue = this.getLastOperation().toString() + value.toString()   
            this.setLastOperation(parseFloat(newValue))
        }
        
        console.log(this._operation)
        this.setLastNumberToDisplay()
        
    }

    setError(){
        this.displayCalc = 'ERROR'
    }


    setDisplayDateTime(){
        this.displayDate = this.currentDate.toLocaleDateString(this._locale)
        this.displayTime = this.currentDate.toLocaleTimeString(this._locale)
    }

    get displayCalc(){
        return this._displayCalc.innerHTML
    }
    set displayCalc(value){
        if(value.toString().length > 9){
            this.setError()
            return false
        }
        this._displayCalc.innerHTML = value
    }

    get displayTime(){
        return this._timeEl.innerHTML
    }

    set displayTime(value){
        this._timeEl.innerHTML = value
    }

    get displayDate(){
        return this._dateEl.innerHTML
    }

    set displayDate(value){
        this._dateEl.innerHTML = value
    }

    get currentDate(){
        return new Date()
    }
    set currentDate(date){
        this._currentDate = date
    }
}
