import { useState, useEffect, useMemo } from 'react'
import { db } from '../data/db'
import type { CartItem } from '../interfaces/cart'
import { Guitar } from '../interfaces/guitar'

export const useCart = () => {
    const initialCart = (): CartItem[] => {
        const localStorageCart = localStorage.getItem('cart')
        return localStorageCart ? JSON.parse(localStorageCart) : []
    }

    const [data] = useState(db)
    const [cart, setCart] = useState(initialCart)

    const MIN_ITEMS = 1
    const MAX_ITEMS = 5

    const addToCart = (item: Guitar) => {
        const itemExists = cart.findIndex((cart) => cart.id === item.id)
        if (itemExists >= 0) {
            if (cart[itemExists].quantity >= MAX_ITEMS) return
            const updatedCart = [...cart]
            updatedCart[itemExists].quantity++
            setCart(updatedCart)
        } else {
            const itemClone: CartItem = Object.assign(
                {},
                { ...item, quantity: 1 }
            )
            setCart([...cart, itemClone])
        }
    }

    const removeFromCart = (id: Guitar['id']) => {
        setCart((prevCart) => prevCart.filter((item) => item.id !== id))
    }

    const increaseQuantity = (id: Guitar['id']) => {
        const updatedCart = cart.map((item) =>
            item.id === id && item.quantity < MAX_ITEMS
                ? { ...item, quantity: item.quantity + 1 }
                : item
        )
        setCart(updatedCart)
    }

    const decreaseQuantity = (id: Guitar['id']) => {
        const updatedCart = cart.map((item) =>
            item.id === id && item.quantity > MIN_ITEMS
                ? { ...item, quantity: item.quantity - 1 }
                : item
        )
        setCart(updatedCart)
    }

    const clearCart = () => {
        setCart([])
    }

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart))
    }, [cart])

    const isEmpty = useMemo(() => !cart.length, [cart])
    const cartTotal = useMemo(
        () =>
            cart.reduce((total, item) => total + item.price * item.quantity, 0),
        [cart]
    )

    return {
        data,
        cart,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        isEmpty,
        cartTotal,
    }
}
