import { createContext, ReactNode, useContext, useState } from "react";
import ShoppingCart from "../components/ShoppingCart";
import {useLocalStorage} from "../hooks/useLocalStorage";

type ShoppingCartProviderProps ={
    children: ReactNode
}

type CartItem = {
    id: number,
    quantity: number
}

// Adding item to cart is the same as incresing the cart quantity.
type ShoppingCartContext = {
    getItemQuantity: (id: number) => number
    increaseCartQuantity: (id: number) => void
    decreaseCartQuantity: (id: number) => void
    removeFromCart: (id: number) => void
    openCart: () => void
    closeCart: () => void
    cartQuantity: number
    cartItems: CartItem[]
}

const ShoppingCartContext = createContext({} as ShoppingCartContext);

export function useShoppingCart() {
    return useContext(ShoppingCartContext)
}

export function ShoppingCartProvider({ children }: ShoppingCartProviderProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [cartItems, setCartItems] = useLocalStorage<CartItem[]>
    (
        "shopping-cart",
        []
    );

    const cartQuantity = cartItems.reduce(
        (quantity, item) => item.quantity + quantity,
        0
    )

    function getItemQuantity(id: number) {
        // Optional chaining checking if the .find() actually finds something, then return the proprty of quantyt if found,
            // else return 0.
        return cartItems.find(item => item.id === id)?.quantity || 0;
    }

    function increaseCartQuantity(id: number)
    {
        setCartItems(currItems => {
            // If the item doesn't exist in the cart, add it to the cart.
            if(currItems.find(item => item.id === id) == null)
            {
                return [...currItems, { id, quantity: 1 }]
            } else {
                // If item does exist, just add 1 to quantity, map works perfect here
                return currItems.map(item => {
                    if(item.id === id)
                    {
                        return { ...item, quantity: item.quantity++ }
                    } else {
                        return item
                    }
                })
            }
        })
    }

    function decreaseCartQuantity(id: number)
    {
        setCartItems(currItems => {
            // If the item quanity equal 1, remove item entirely from the cart.
            if(currItems.find(item => item.id === id)?.quantity === 1)
            { 
                // filter out the removed item
                return currItems.filter(item => item.id !== id);
            } else {
                // If item quantity is above 1, just remove 1 from quantity, map works perfect here
                // I feel that there should be some eextra error handling here just in case
                return currItems.map(item => {
                    if(item.id === id)
                    {
                        return { ...item, quantity: item.quantity-- }
                    } else {
                        return item
                    }
                })
            }
        })
    }

    function removeFromCart(id: number) {
        setCartItems(currItems => {
            return currItems.filter(item => item.id !== id);
                // I feel as though this qwoudl work better just in case of any faulty behvior in our logic
            // if(currItems.find(item => item.id === id))
            // {
            //     return currItems.filter(item => item.id != id)
            // } else {
            //     return currItems;
            // }
        })
    }

    function openCart() {
        setIsOpen(true);
    }
    function closeCart() {
        setIsOpen(false);
    }

    return <ShoppingCartContext.Provider value={{ getItemQuantity, increaseCartQuantity, decreaseCartQuantity, removeFromCart, cartItems, cartQuantity, openCart, closeCart }}>
        {children}
        <ShoppingCart isOpen={isOpen} />
    </ShoppingCartContext.Provider>
}