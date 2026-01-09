import { Elysia } from "elysia";
import openapiTS, { astToString } from "openapi-typescript";
import { buildServiceUrl } from "@lib/utils";
import { env } from "@src/env";

const PORT = process.env.PORT || env.APP_PORT!;

const USAGE_HEADER = `/**
 * Auto-generated TypeScript types from OpenAPI specification
 * 
 * USAGE WITH openapi-fetch (recommended for separate projects):
 * 
 * 1. Install: bun add openapi-fetch
 * 2. Download types: curl http://your-server/types -o src/api.d.ts
 * 3. Use in your code:
 * 
 *    import createClient from 'openapi-fetch';
 *    import type { paths } from './api';
 *    
 *    const client = createClient<paths>({ baseUrl: 'http://localhost:3000' });
 *    
 *    const { data } = await client.GET('/user/{id}', {
 *      params: { path: { id: '123' } }
 *    });
 */

`;

/**
 * Route to generate and serve TypeScript types from OpenAPI spec
 */
export const types = new Elysia({ prefix: "/types" })
  .get("/", async ({ set }) => {
    try {
      const openApiUrl = buildServiceUrl(PORT, "/openapi/json");
      const ast = await openapiTS(new URL(openApiUrl));
      const contents = astToString(ast);
      
      set.headers["Content-Type"] = "text/typescript";
      set.headers["Content-Disposition"] = 'attachment; filename="api.d.ts"';
      
      return USAGE_HEADER + contents;
    } catch (error) {
      set.status = 500;
      return { 
        error: "Failed to generate types", 
        message: error instanceof Error ? error.message : "Unknown error" 
      };
    }
  })
  .get("/preview", async ({ set }) => {
    try {
      const openApiUrl = buildServiceUrl(PORT, "/openapi/json");
      const ast = await openapiTS(new URL(openApiUrl));
      const contents = astToString(ast);
      
      set.headers["Content-Type"] = "text/plain";
      return USAGE_HEADER + contents;
    } catch (error) {
      set.status = 500;
      return { 
        error: "Failed to generate types", 
        message: error instanceof Error ? error.message : "Unknown error" 
      };
    }
  });

