import { createContext, useContext, useReducer } from 'react'

const CartContext = createContext(null)

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const existing = state.find((i) => i.id === action.item.id)
      if (existing) {
        return state.map((i) =>
          i.id === action.item.id ? { ...i, qty: i.qty + 1 } : i
        )
      }
      return [...state, { ...action.item, qty: 1 }]
    }
    case 'REMOVE':
      return state.filter((i) => i.id !== action.id)
    case 'INCREMENT':
      return state.map((i) =>
        i.id === action.id ? { ...i, qty: i.qty + 1 } : i
      )
    case 'DECREMENT':
      return state
        .map((i) => (i.id === action.id ? { ...i, qty: i.qty - 1 } : i))
        .filter((i) => i.qty > 0)
    case 'CLEAR':
      return []
    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(cartReducer, [])

  const addItem = (item) => dispatch({ type: 'ADD', item })
  const removeItem = (id) => dispatch({ type: 'REMOVE', id })
  const increment = (id) => dispatch({ type: 'INCREMENT', id })
  const decrement = (id) => dispatch({ type: 'DECREMENT', id })
  const clearCart = () => dispatch({ type: 'CLEAR' })

  const totalItems = cart.reduce((sum, i) => sum + i.qty, 0)
  const totalPrice = cart.reduce((sum, i) => sum + i.price * i.qty, 0)

  return (
    <CartContext.Provider
      value={{ cart, addItem, removeItem, increment, decrement, clearCart, totalItems, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}
