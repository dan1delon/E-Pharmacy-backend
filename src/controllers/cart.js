import { CartCollection } from '../db/models/cart.js';
import { ProductsCollection } from '../db/models/products.js';

export const updateCart = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { productId, quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({ message: 'Quantity must be at least 1' });
    }

    const product = await ProductsCollection.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const cart = await CartCollection.findOne({ userId });

    if (!cart) {
      const newCart = new CartCollection({
        userId,
        items: [{ product: product._id, quantity }],
      });
      await newCart.save();
      return res
        .status(201)
        .json({ message: 'Cart created and item added', data: newCart });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId,
    );

    if (itemIndex !== -1) {
      cart.items[itemIndex].quantity = quantity;
    } else {
      cart.items.push({ product: product._id, quantity });
    }

    await cart.save();

    res.status(200).json({ message: 'Cart updated successfully', data: cart });
  } catch (error) {
    console.error('Error in updateCart:', error);
    next(error);
  }
};

export const getCartItems = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const cart = await CartCollection.findOne({ userId }).populate(
      'items.product',
    );

    if (!cart) {
      return res.status(200).json({ data: [], message: 'Cart is empty' });
    }

    res.status(200).json({
      status: '200',
      data: cart.items,
      message: 'Successfully fetched cart items',
    });
  } catch (error) {
    console.error('Error in getCartItems:', error);
    next(error);
  }
};

export const checkoutCart = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const cart = await CartCollection.findOne({ userId });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    await CartCollection.deleteOne({ userId });

    res
      .status(200)
      .json({ message: 'Order placed successfully and cart cleared' });
  } catch (error) {
    console.error('Error in checkoutCart:', error);
    next(error);
  }
};
