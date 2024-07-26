import { createContext } from 'react'; 

const CartContext = createContet({
    items: [], 
    addItem: (item) => {}, 
    removeItem: (id) => {}
});

export default function CartContextProvider({children}){
    

    return <CartContext.Provider>{children}</CartContext.Provider>
}

export default CartContext;