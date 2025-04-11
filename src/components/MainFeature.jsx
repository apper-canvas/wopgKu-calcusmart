import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, RotateCcw, Plus, Minus, X, Divide, Percent, ArrowUp, ArrowDown } from 'lucide-react'

const MainFeature = ({ onCalculation }) => {
  const [displayValue, setDisplayValue] = useState('0')
  const [currentInput, setCurrentInput] = useState('')
  const [previousOperand, setPreviousOperand] = useState(null)
  const [operation, setOperation] = useState(null)
  const [memoryValue, setMemoryValue] = useState(0)
  const [waitingForOperand, setWaitingForOperand] = useState(true)
  const [showMemoryIndicator, setShowMemoryIndicator] = useState(false)
  
  // Handle memory indicator animation
  useEffect(() => {
    if (memoryValue !== 0) {
      setShowMemoryIndicator(true)
      const timer = setTimeout(() => setShowMemoryIndicator(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [memoryValue])
  
  // Clear all calculator state
  const clearAll = () => {
    setDisplayValue('0')
    setCurrentInput('')
    setPreviousOperand(null)
    setOperation(null)
    setWaitingForOperand(true)
  }
  
  // Clear current entry only
  const clearEntry = () => {
    setDisplayValue('0')
    setWaitingForOperand(true)
  }
  
  // Handle digit input
  const inputDigit = (digit) => {
    if (waitingForOperand) {
      setDisplayValue(digit)
      setCurrentInput(digit)
      setWaitingForOperand(false)
    } else {
      // Prevent multiple zeros at the beginning
      if (displayValue === '0' && digit === '0') return
      
      // Replace initial zero unless it's a decimal point
      if (displayValue === '0' && digit !== '.') {
        setDisplayValue(digit)
        setCurrentInput(digit)
      } else {
        // Don't allow multiple decimal points
        if (digit === '.' && displayValue.includes('.')) return
        
        const newValue = displayValue + digit
        setDisplayValue(newValue)
        setCurrentInput(newValue)
      }
    }
  }
  
  // Handle decimal point
  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplayValue('0.')
      setCurrentInput('0.')
      setWaitingForOperand(false)
    } else if (!displayValue.includes('.')) {
      setDisplayValue(displayValue + '.')
      setCurrentInput(currentInput + '.')
    }
  }
  
  // Handle operations (+, -, *, /)
  const handleOperation = (nextOperation) => {
    const inputValue = parseFloat(displayValue)
    
    if (previousOperand === null) {
      setPreviousOperand(inputValue)
    } else if (operation) {
      const result = performCalculation()
      setPreviousOperand(result)
      setDisplayValue(String(result))
      
      // Add to calculation history
      const expression = `${previousOperand} ${getOperationSymbol(operation)} ${inputValue}`
      onCalculation(expression, result)
    }
    
    setWaitingForOperand(true)
    setOperation(nextOperation)
  }
  
  // Get operation symbol for display
  const getOperationSymbol = (op) => {
    switch (op) {
      case 'add': return '+'
      case 'subtract': return '-'
      case 'multiply': return '×'
      case 'divide': return '÷'
      case 'percent': return '%'
      default: return ''
    }
  }
  
  // Perform calculation based on operation
  const performCalculation = () => {
    const inputValue = parseFloat(displayValue)
    
    if (isNaN(previousOperand) || isNaN(inputValue)) return inputValue
    
    let result
    switch (operation) {
      case 'add':
        result = previousOperand + inputValue
        break
      case 'subtract':
        result = previousOperand - inputValue
        break
      case 'multiply':
        result = previousOperand * inputValue
        break
      case 'divide':
        result = previousOperand / inputValue
        break
      case 'percent':
        result = previousOperand * (inputValue / 100)
        break
      default:
        return inputValue
    }
    
    return Math.round(result * 1000000) / 1000000 // Handle floating point precision
  }
  
  // Calculate final result
  const handleEquals = () => {
    if (operation === null) return
    
    const inputValue = parseFloat(displayValue)
    const result = performCalculation()
    
    // Add to calculation history
    const expression = `${previousOperand} ${getOperationSymbol(operation)} ${inputValue}`
    onCalculation(expression, result)
    
    setDisplayValue(String(result))
    setPreviousOperand(null)
    setOperation(null)
    setWaitingForOperand(true)
  }
  
  // Toggle positive/negative
  const toggleSign = () => {
    const newValue = parseFloat(displayValue) * -1
    setDisplayValue(String(newValue))
    setCurrentInput(String(newValue))
  }
  
  // Calculate percentage
  const percentage = () => {
    const currentValue = parseFloat(displayValue)
    const newValue = currentValue / 100
    setDisplayValue(String(newValue))
    setCurrentInput(String(newValue))
  }
  
  // Memory functions
  const memoryAdd = () => {
    setMemoryValue(memoryValue + parseFloat(displayValue))
    setWaitingForOperand(true)
  }
  
  const memorySubtract = () => {
    setMemoryValue(memoryValue - parseFloat(displayValue))
    setWaitingForOperand(true)
  }
  
  const memoryRecall = () => {
    setDisplayValue(String(memoryValue))
    setWaitingForOperand(true)
  }
  
  const memoryClear = () => {
    setMemoryValue(0)
  }
  
  return (
    <div className="bg-white dark:bg-surface-800 rounded-2xl p-6 shadow-card dark:shadow-none relative overflow-hidden">
      <AnimatePresence>
        {showMemoryIndicator && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute top-4 right-4 bg-primary text-white text-xs px-2 py-1 rounded-full"
          >
            Memory: {memoryValue}
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="calculator-display mb-6">
        <div className="text-sm text-surface-500 dark:text-surface-400 h-6 text-right">
          {previousOperand !== null ? 
            `${previousOperand} ${getOperationSymbol(operation)}` : 
            ''}
        </div>
        <div className="text-3xl font-bold overflow-x-auto whitespace-nowrap">
          {displayValue}
        </div>
      </div>
      
      <div className="grid grid-cols-4 gap-3">
        {/* Memory functions row */}
        <button onClick={memoryClear} className="calculator-key-function">MC</button>
        <button onClick={memoryRecall} className="calculator-key-function">MR</button>
        <button onClick={memoryAdd} className="calculator-key-function">M+</button>
        <button onClick={memorySubtract} className="calculator-key-function">M-</button>
        
        {/* Function row */}
        <button onClick={clearAll} className="calculator-key-function">
          <Trash2 size={20} />
        </button>
        <button onClick={clearEntry} className="calculator-key-function">
          <RotateCcw size={20} />
        </button>
        <button onClick={percentage} className="calculator-key-function">
          <Percent size={20} />
        </button>
        <button onClick={() => handleOperation('divide')} className="calculator-key-operation">
          <Divide size={20} />
        </button>
        
        {/* Number rows */}
        <button onClick={() => inputDigit('7')} className="calculator-key-number">7</button>
        <button onClick={() => inputDigit('8')} className="calculator-key-number">8</button>
        <button onClick={() => inputDigit('9')} className="calculator-key-number">9</button>
        <button onClick={() => handleOperation('multiply')} className="calculator-key-operation">
          <X size={20} />
        </button>
        
        <button onClick={() => inputDigit('4')} className="calculator-key-number">4</button>
        <button onClick={() => inputDigit('5')} className="calculator-key-number">5</button>
        <button onClick={() => inputDigit('6')} className="calculator-key-number">6</button>
        <button onClick={() => handleOperation('subtract')} className="calculator-key-operation">
          <Minus size={20} />
        </button>
        
        <button onClick={() => inputDigit('1')} className="calculator-key-number">1</button>
        <button onClick={() => inputDigit('2')} className="calculator-key-number">2</button>
        <button onClick={() => inputDigit('3')} className="calculator-key-number">3</button>
        <button onClick={() => handleOperation('add')} className="calculator-key-operation">
          <Plus size={20} />
        </button>
        
        <button onClick={toggleSign} className="calculator-key-number">
          <div className="flex flex-col items-center">
            <ArrowUp size={12} />
            <ArrowDown size={12} />
          </div>
        </button>
        <button onClick={() => inputDigit('0')} className="calculator-key-number">0</button>
        <button onClick={inputDecimal} className="calculator-key-number">.</button>
        <button onClick={handleEquals} className="calculator-key-equals">=</button>
      </div>
      
      <div className="mt-6 text-xs text-surface-500 dark:text-surface-400">
        <p>Tip: Use keyboard for input. Press Enter for equals, Escape to clear.</p>
      </div>
    </div>
  )
}

export default MainFeature