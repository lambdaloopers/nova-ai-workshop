import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { readFileSync } from 'fs';
import { join } from 'path';
import type { Product, Category } from '@/lib/types';

/**
 * Catalog query tool that searches products from the JSON data.
 * Supports filtering by category, price range, brand, and search query.
 */
export const catalogQueryTool = createTool({
  id: 'catalog-query',
  description: `
Search the Nova electronics catalog to find products matching customer needs.
Use this tool when customers ask for product recommendations, comparisons, or specific items.
Returns a list of products with full details (name, price, specs, availability).
`,
  inputSchema: z.object({
    query: z
      .string()
      .optional()
      .describe('Search keywords to match against product names and specs (e.g., "gaming laptop", "mechanical keyboard")'),
    categoryId: z
      .string()
      .optional()
      .describe('Filter by category ID (e.g., "laptops", "monitors", "components")'),
    maxPrice: z
      .number()
      .optional()
      .describe('Maximum price in euros (e.g., 1000)'),
    minPrice: z
      .number()
      .optional()
      .describe('Minimum price in euros (e.g., 500)'),
    brand: z
      .string()
      .optional()
      .describe('Filter by brand name (e.g., "ASUS", "Corsair", "Samsung")'),
    limit: z
      .number()
      .optional()
      .default(5)
      .describe('Maximum number of products to return (default: 5, max: 10)'),
  }),

  execute: async ({ query, categoryId, maxPrice, minPrice, brand, limit = 5 }) => {
    try {
      // Read products from JSON file
      const productsPath = join(process.cwd(), 'data', 'products.json');
      const categoriesPath = join(process.cwd(), 'data', 'categories.json');
      
      const products: Product[] = JSON.parse(readFileSync(productsPath, 'utf-8'));
      const categories: Category[] = JSON.parse(readFileSync(categoriesPath, 'utf-8'));

      // Filter products
      let filtered = products.filter((p) => p.inStock); // Only in-stock products

      // Category filter
      if (categoryId) {
        filtered = filtered.filter((p) => p.categoryId === categoryId);
      }

      // Price filters
      if (maxPrice !== undefined) {
        filtered = filtered.filter((p) => p.price <= maxPrice);
      }
      if (minPrice !== undefined) {
        filtered = filtered.filter((p) => p.price >= minPrice);
      }

      // Brand filter
      if (brand) {
        filtered = filtered.filter(
          (p) => p.brand.toLowerCase() === brand.toLowerCase(),
        );
      }

      // Text search filter
      if (query) {
        const searchLower = query.toLowerCase();
        filtered = filtered.filter((p) => {
          const matchesName = p.name.toLowerCase().includes(searchLower);
          const matchesBrand = p.brand.toLowerCase().includes(searchLower);
          const matchesSpecs = Object.values(p.specs).some((spec) =>
            spec.toLowerCase().includes(searchLower),
          );
          return matchesName || matchesBrand || matchesSpecs;
        });
      }

      // Sort by rating (best first)
      filtered.sort((a, b) => b.rating - a.rating);

      // Limit results
      const results = filtered.slice(0, Math.min(limit, 10));

      // Return structured product data
      return {
        success: true,
        count: results.length,
        totalInCatalog: products.length,
        products: results.map((p) => {
          const category = categories.find((c) => c.id === p.categoryId);
          return {
            id: p.id,
            name: p.name,
            brand: p.brand,
            category: category?.name || p.categoryId,
            price: p.price,
            originalPrice: p.originalPrice,
            discount: p.discount,
            rating: p.rating,
            reviewCount: p.reviewCount,
            image: p.image,
            specs: p.specs,
            badges: p.badges,
            freeShipping: p.freeShipping,
            deliveryEstimate: p.deliveryEstimate,
            slug: p.slug,
          };
        }),
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to query catalog',
        products: [],
      };
    }
  },
});
