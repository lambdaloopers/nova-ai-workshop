import { createTool } from "@mastra/core/tools";
import z from "zod";

export const marketplaceProductSuggestionTool = createTool({
    id: "marketplace-product-suggestion",
    description: "Suggest a product for the marketplace",
    inputSchema: z.object({
      query: z.string().describe("The query to suggest a product for"),
    }),
    execute: async (inputData, context) => {
      // gathering liked products from the user
      await context?.writer?.write({
        type: "data-tool-product-suggestion-status",
        data: {
          status: "in-progress",
          message: "Looking for liked products",
        },
      });
      const likedProducts = await new Promise((resolve) => {
        return setTimeout(() => {
          resolve(["Product 1", "Product 2", "Product 3"]);
        }, 10000);
      });
      await context?.writer?.write({
        type: "data-tool-product-suggestion-status",
        data: {
          status: "in-progress",
          message: "Looking for marketplace products",
        },
      });
      // getting products from the marketplace
      const marketplaceProducts = await new Promise((resolve) => {
        return setTimeout(() => {
          resolve(["Product 4", "Product 5", "Product 6"]);
        }, 10000);
      });
      await context?.writer?.write({
        type: "data-product-suggestion-status",
        data: {
          status: "in-progress",
          message: "Combining products",
        },
      });
      // combining the products and returning the best one
      const combinedProducts = await new Promise((resolve) => {
        return setTimeout(() => {
          resolve(
            [
              ...(likedProducts as string[]),
              ...(marketplaceProducts as string[]),
            ][0],
          );
        }, 10000);
      });
      await context?.writer?.write({
        type: "data-tool-product-suggestion-result",
        data: {
          status: "success",
          message: "Product suggestion completed",
          product: combinedProducts as string,
        },
      });
      return {
        product: combinedProducts as string,
        status: "success",
        message: "Product suggestion completed",
      };
    },
  });