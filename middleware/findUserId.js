import { db } from "../db/db.js";
import { apiKeys } from "../drizzle/schema.js";
import { eq } from "drizzle-orm";

export const findUserIdMiddleware = async (req, res, next) => {
    try {
      // Extract apiKey from headers
      const apiKey = req.headers['x-api-key'];
      console.log(apiKey);
  
      if (!apiKey) {
        return res.status(401).json({ error: 'API key is required' });
      }
  
      // Query the database for the user
      const user = await db.select().from(apiKeys).where(eq(apiKeys.apiKey, apiKey));
  
      if (user.length===0) {
        return res.status(401).json({ error: 'Invalid API key' });
      }
  
      // Attach userId to the req object
      req.userId = user[0].userId;
  
      next(); // Proceed to the next middleware or route handler
    } catch (error) {
      console.error('Error in findUserIdMiddleware:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
