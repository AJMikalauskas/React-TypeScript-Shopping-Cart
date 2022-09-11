import { useEffect, useState } from "react";

// initialValue will have it's type as an array which can be seen from the context but it can also be it's type of array 
    // if returned from a function
export function useLocalStorage<T>(key: string, initialValue: T | (() => T)) {
    // Typescript expects a type specification by <> on useState and even if not, you should still define it.
    const [value, setValue] = useState<T>(() => {
        // gets items stored in localStorage by the key of "shopping-cart" seen in SHoppingCartContext.tsx
        const jsonValue = localStorage.getItem(key);
        // if there exists a value in the shopping cart from local storage, return it and convert from JSON to readable values
        if(jsonValue != null) return JSON.parse(jsonValue);

        // This original if condition is the 2nd case in the OR pipe from the params above; This is the way it's handled, 
            // if a function type, returns initialValue as a function <T> else just returns initialValue
    if(typeof initialValue === "function") {
        return (initialValue as () => T)()
    } else {
        return initialValue
    }
});
   
// key changes off start and value changes every time, This will change value to new cartItems every time there is a change to 
// the overall items in the cart
    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(value))
    }, [key,value])

    // Need to return these as typeOfs so that the reduce method() in the ShoppingCartContext to set the cartItems
    // because the reduce can't read the types as  CartItem[] | React.Dispatch<React.SetStateAction<CartItem[]>>
    return [value, setValue] as [typeof value, typeof setValue];
}