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

CRITICAL: Always pass categoryId when the customer specified a product type:
- laptop/portátil → categoryId: "laptops"
- monitor → categoryId: "monitors"  
- keyboard/teclado, mouse, headset → categoryId: "peripherals"
- components, RAM, SSD → categoryId: "components"
Never return products from the wrong category (e.g. no headsets when they asked for laptops).

IMPORTANT: Only call this AFTER you have use case and budget from the user. Do not call in the first message when you need to ask clarifying questions.
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
      const searchTerms = query?.toLowerCase().trim().split(/\s+/) ?? [];
      if (searchTerms.length > 0) {
        filtered = filtered.filter((p) => {
          const searchable =
            `${p.name} ${p.brand} ${Object.values(p.specs).join(' ')}`.toLowerCase();
          // Match if ALL query terms appear somewhere (e.g. "wireless keyboard" -> both in Razer)
          return searchTerms.every((term) => searchable.includes(term));
        });
      }

      // Sort by rating (best first)
      filtered.sort((a, b) => b.rating - a.rating);

      // FALLBACK: when no results, always suggest related products
      let results = filtered.slice(0, Math.min(limit, 10));
      let fallbackUsed = false;

      if (results.length === 0) {
        fallbackUsed = true;
        let fallback = products.filter((p) => p.inStock);

        // Prefer same category if we had one
        if (categoryId) {
          const inCategory = fallback.filter((p) => p.categoryId === categoryId);
          if (inCategory.length > 0) fallback = inCategory;
        }
        // Else: try broad query (first meaningful word: keyboard, laptop, monitor...)
        else if (searchTerms.length > 0) {
          const mainTerm = searchTerms.find(
            (t) => t.length > 2 && !/^(the|and|for|con|del|los|una|un)$/i.test(t)
          );
          if (mainTerm) {
            const related = fallback.filter((p) => {
              const s = `${p.name} ${Object.values(p.specs).join(' ')}`.toLowerCase();
              return s.includes(mainTerm);
            });
            if (related.length > 0) fallback = related;
          }
        }

        fallback.sort((a, b) => b.rating - a.rating);
        results = fallback.slice(0, Math.min(limit, 10));
      }

      // Return structured product data
      return {
        success: results.length > 0,
        count: results.length,
        fallbackUsed,
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
