import { useState } from 'react'
import { motion } from 'framer-motion'
import MainFeature from '../components/MainFeature'

const Home = () => {
  const [calculationHistory, setCalculationHistory] = useState([])
  
  const addToHistory = (expression, result) => {
    const newEntry = {
      id: Date.now().toString(),
      expression,
      result,
      timestamp: new Date()
    }
    setCalculationHistory(prev => [newEntry, ...prev].slice(0, 10))
  }
  
  const clearHistory = () => {
    setCalculationHistory([])
  }
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 text-center"
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Smart Calculations, <span className="text-primary">Simplified</span>
        </h1>
        <p className="text-surface-600 dark:text-surface-400 max-w-2xl mx-auto">
          Perform quick calculations with our intuitive calculator featuring memory functions and calculation history.
        </p>
      </motion.div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-2"
        >
          <MainFeature onCalculation={addToHistory} />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white dark:bg-surface-800 rounded-2xl p-6 shadow-card dark:shadow-none h-fit"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">History</h2>
            {calculationHistory.length > 0 && (
              <button 
                onClick={clearHistory}
                className="text-sm text-secondary hover:text-secondary-dark transition-colors"
              >
                Clear All
              </button>
            )}
          </div>
          
          {calculationHistory.length === 0 ? (
            <div className="text-center py-8 text-surface-500">
              <p>No calculations yet</p>
              <p className="text-sm mt-2">Your calculation history will appear here</p>
            </div>
          ) : (
            <ul className="space-y-3 max-h-[400px] overflow-y-auto scrollbar-hide">
              {calculationHistory.map(entry => (
                <li 
                  key={entry.id}
                  className="p-3 bg-surface-50 dark:bg-surface-700 rounded-xl"
                >
                  <div className="text-sm text-surface-500 dark:text-surface-400">
                    {entry.expression}
                  </div>
                  <div className="text-lg font-medium">
                    = {entry.result}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default Home