import { describe, test, expect, jest, beforeEach } from '@jest/globals';

// Mock the model
jest.mock('../../models/ProductModal.js', () => ({
    default: {
        find: jest.fn(),
        countDocuments: jest.fn()
    }
}));

import { searchProducts } from '../../services/ProductService.js';
import productModel from '../../models/ProductModal.js';

describe('ProductService.searchProducts', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('returns paginated products with no filters', async () => {
        const mockProducts = [{ name: 'Saree', price: 500 }];
        productModel.find.mockReturnValue({
            sort: jest.fn().mockReturnValue({
                skip: jest.fn().mockReturnValue({
                    limit: jest.fn().mockReturnValue({ lean: jest.fn().mockResolvedValue(mockProducts) })
                })
            })
        });
        productModel.countDocuments.mockResolvedValue(1);

        const result = await searchProducts({ page: 1, limit: 20 });
        expect(result.products).toHaveLength(1);
        expect(result.total).toBe(1);
    });

    test('applies category filter', async () => {
        productModel.find.mockReturnValue({
            sort: jest.fn().mockReturnValue({
                skip: jest.fn().mockReturnValue({
                    limit: jest.fn().mockReturnValue({ lean: jest.fn().mockResolvedValue([]) })
                })
            })
        });
        productModel.countDocuments.mockResolvedValue(0);

        await searchProducts({ category: 'Sarees' });
        expect(productModel.find).toHaveBeenCalledWith(expect.objectContaining({ category: 'Sarees' }));
    });

    test('applies price range filter', async () => {
        productModel.find.mockReturnValue({
            sort: jest.fn().mockReturnValue({
                skip: jest.fn().mockReturnValue({
                    limit: jest.fn().mockReturnValue({ lean: jest.fn().mockResolvedValue([]) })
                })
            })
        });
        productModel.countDocuments.mockResolvedValue(0);

        await searchProducts({ minPrice: 100, maxPrice: 500 });
        expect(productModel.find).toHaveBeenCalledWith(expect.objectContaining({
            price: { $gte: 100, $lte: 500 }
        }));
    });

    test('uses text search when q is provided', async () => {
        productModel.find.mockReturnValue({
            sort: jest.fn().mockReturnValue({
                skip: jest.fn().mockReturnValue({
                    limit: jest.fn().mockReturnValue({ lean: jest.fn().mockResolvedValue([]) })
                })
            })
        });
        productModel.countDocuments.mockResolvedValue(0);

        await searchProducts({ q: 'handloom' });
        expect(productModel.find).toHaveBeenCalledWith(expect.objectContaining({
            $text: { $search: 'handloom' }
        }));
    });
});
