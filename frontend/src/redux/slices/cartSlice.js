import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

// Get cart from localStorage for guests
const getLocalCart = () => {
  const cart = localStorage.getItem('cart');
  return cart ? JSON.parse(cart) : { items: [] };
};

const saveLocalCart = (cart) => {
  localStorage.setItem('cart', JSON.stringify(cart));
};

const initialState = {
  items: getLocalCart().items,
  isLoading: false,
  error: null,
};

// Fetch cart from server (for logged-in users)
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/cart');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch cart'
      );
    }
  }
);

// Sync local cart with server
export const syncCart = createAsyncThunk(
  'cart/syncCart',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { items } = getState().cart;
      const localItems = items.map(item => ({
        productId: item.product._id || item.product,
        quantity: item.quantity
      }));
      
      const response = await api.post('/cart/sync', { items: localItems });
      localStorage.removeItem('cart');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to sync cart'
      );
    }
  }
);

// Add to cart (server)
export const addToCartServer = createAsyncThunk(
  'cart/addToCartServer',
  async ({ productId, quantity = 1 }, { rejectWithValue }) => {
    try {
      const response = await api.post('/cart', { productId, quantity });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to add to cart'
      );
    }
  }
);

// Update cart item (server)
export const updateCartItemServer = createAsyncThunk(
  'cart/updateCartItemServer',
  async ({ itemId, quantity }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/cart/${itemId}`, { quantity });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update cart'
      );
    }
  }
);

// Remove from cart (server)
export const removeFromCartServer = createAsyncThunk(
  'cart/removeFromCartServer',
  async (itemId, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/cart/${itemId}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to remove from cart'
      );
    }
  }
);

// Clear cart (server)
export const clearCartServer = createAsyncThunk(
  'cart/clearCartServer',
  async (_, { rejectWithValue }) => {
    try {
      await api.delete('/cart');
      return { items: [] };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to clear cart'
      );
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Local cart actions (for guests)
    addToCartLocal: (state, action) => {
      const { product, quantity = 1 } = action.payload;
      const existingItem = state.items.find(
        item => (item.product._id || item.product) === product._id
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({
          _id: `local_${Date.now()}`,
          product,
          quantity,
          price: product.price
        });
      }
      saveLocalCart({ items: state.items });
    },
    
    updateCartItemLocal: (state, action) => {
      const { itemId, quantity } = action.payload;
      const item = state.items.find(item => item._id === itemId);
      
      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter(i => i._id !== itemId);
        } else {
          item.quantity = quantity;
        }
        saveLocalCart({ items: state.items });
      }
    },
    
    removeFromCartLocal: (state, action) => {
      state.items = state.items.filter(item => item._id !== action.payload);
      saveLocalCart({ items: state.items });
    },
    
    clearCartLocal: (state) => {
      state.items = [];
      localStorage.removeItem('cart');
    },
    
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch cart
      .addCase(fetchCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.items || [];
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Sync cart
      .addCase(syncCart.fulfilled, (state, action) => {
        state.items = action.payload.items || [];
      })
      // Add to cart
      .addCase(addToCartServer.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addToCartServer.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.items || [];
      })
      .addCase(addToCartServer.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update cart item
      .addCase(updateCartItemServer.fulfilled, (state, action) => {
        state.items = action.payload.items || [];
      })
      // Remove from cart
      .addCase(removeFromCartServer.fulfilled, (state, action) => {
        state.items = action.payload.items || [];
      })
      // Clear cart
      .addCase(clearCartServer.fulfilled, (state) => {
        state.items = [];
      });
  },
});

export const {
  addToCartLocal,
  updateCartItemLocal,
  removeFromCartLocal,
  clearCartLocal,
  clearError,
} = cartSlice.actions;

// Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectCartTotal = (state) =>
  state.cart.items.reduce(
    (total, item) => total + (item.price || item.product?.price || 0) * item.quantity,
    0
  );
export const selectCartCount = (state) =>
  state.cart.items.reduce((count, item) => count + item.quantity, 0);

export default cartSlice.reducer;

