import "../setup";
import { describe, expect, it, mock } from "bun:test";
import { app } from "@app/_app";
import { authHeaders } from "../setup";

// Mock the database helpers to avoid connection issues during tests
mock.module("@db/helper", () => ({
  findAll: () => Promise.resolve([]),
  insertOne: (db: any, table: any, data: any) =>
    Promise.resolve({
      id: "1",
      created_at: new Date(),
      updated_at: new Date(),
      ...data,
    }),
  findById: () => Promise.resolve(undefined),
  updateById: () => Promise.resolve(undefined),
  deleteById: () => Promise.resolve(undefined),
}));

describe("User Routes", () => {
  describe("GET /user", () => {
    it("should return users list", async () => {
      const response = await app.handle(
        new Request("http://localhost/user", {
          headers: authHeaders,
        }),
      );

      expect(response.status).toBe(200);
      const json = await response.json();
      expect(json.success).toBe(true);
      expect(Array.isArray(json.data)).toBe(true);
    });
  });

  describe("POST /user", () => {
    it("should create a user", async () => {
      const userData = {
        name: "Test User",
        email: `test@example.com`,
        password: "securepassword123",
      };

      const response = await app.handle(
        new Request("http://localhost/user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...authHeaders,
          },
          body: JSON.stringify(userData),
        }),
      );

      expect(response.status).toBe(200);
      const json = await response.json();
      expect(json.success).toBe(true);
      expect(json.data.name).toBe(userData.name);
      expect(json.data.email).toBe(userData.email);
    });

    it("should return 422 for invalid email", async () => {
      const response = await app.handle(
        new Request("http://localhost/user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...authHeaders,
          },
          body: JSON.stringify({ name: "Test" }),
        }),
      );

      expect(response.status).toBe(422);
    });
  });

  describe("GET /user/:id", () => {
    it("should return 404 for non-existent user", async () => {
      const response = await app.handle(
        new Request("http://localhost/user/non-existent", {
          headers: authHeaders,
        }),
      );
      expect(response.status).toBe(404);
    });
  });

  describe("PUT /user/:id", () => {
    it("should return 404 for update non-existent user", async () => {
      const response = await app.handle(
        new Request("http://localhost/user/non-existent", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...authHeaders,
          },
          body: JSON.stringify({ name: "Updated" }),
        }),
      );
      expect(response.status).toBe(404);
    });
  });

  describe("DELETE /user/:id", () => {
    it("should return 404 for delete non-existent user", async () => {
      const response = await app.handle(
        new Request("http://localhost/user/non-existent", {
          method: "DELETE",
          headers: authHeaders,
        }),
      );
      expect(response.status).toBe(404);
    });
  });
});
