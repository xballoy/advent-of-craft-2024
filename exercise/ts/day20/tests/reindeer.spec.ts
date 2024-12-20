import type { Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { v4 as uuidv4 } from 'uuid';
import { app } from '../src';
import { ReindeerColor } from '../src/types';

describe('Reindeer API', () => {
  let server: Server;
  let baseUrl: string;

  beforeAll(async () => {
    return new Promise<void>((resolve) => {
      server = app.listen(() => {
        const { port } = server.address() as AddressInfo;
        baseUrl = `http://localhost:${port}`;
        resolve();
      });

      server.on('error', (error) => {
        console.error('Server error:', error);
      });
    });
  });

  afterAll(async () => {
    return new Promise<void>((resolve, reject) => {
      server.close((err) => {
        if (err) {
          console.error('Error closing server:', err);
          reject(err);
          return;
        }
        resolve();
      });

      setTimeout(() => {
        server.closeAllConnections?.();
      }, 1_000);
    });
  });

  describe('when using a valid API Key', () => {
    const VALID_API_KEY = '2FE35BA7-4894-445D-BDE1-F8E3D951A9A5';

    it('should get a reindeer', async () => {
      const response = await fetch(
        `${baseUrl}/reindeer/40f9d24d-d3e0-4596-adc5-b4936ff84b19`,
        {
          headers: { 'X-API-Key': VALID_API_KEY },
        },
      );
      expect(response.status).toBe(200);
      const body = await response.text();
      expect(body).toMatchInlineSnapshot(
        `"{"id":"40f9d24d-d3e0-4596-adc5-b4936ff84b19","name":"Petar","color":1}"`,
      );
    });

    it('should return not found for non-existing reindeer', async () => {
      const nonExistingReindeer = uuidv4();
      const response = await fetch(
        `${baseUrl}/reindeer/${nonExistingReindeer}`,
        {
          headers: { 'X-API-Key': VALID_API_KEY },
        },
      );
      expect(response.status).toBe(404);
      const body = await response.text();
      expect(body).toMatchInlineSnapshot(`"Reindeer not found"`);
    });

    it('should return conflict when trying to create an existing reindeer', async () => {
      const requestPayload = {
        name: 'Petar',
        color: ReindeerColor.Purple,
      };
      const response = await fetch(`${baseUrl}/reindeer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': VALID_API_KEY,
        },
        body: JSON.stringify(requestPayload),
      });
      expect(response.status).toBe(409);
      const body = await response.text();
      expect(body).toMatchInlineSnapshot(`"Reindeer already exists"`);
    });
  });

  describe('when using an invalid API Key', () => {
    const INVALID_API_KEY = '75EF9DF2-7453-495F-BA26-379C17939AAC';

    it('should return an error when getting a reindeer', async () => {
      const response = await fetch(
        `${baseUrl}/reindeer/40f9d24d-d3e0-4596-adc5-b4936ff84b19`,
        {
          headers: { 'X-API-Key': INVALID_API_KEY },
        },
      );
      expect(response.status).toBe(403);
      const body = await response.text();
      expect(body).toMatchInlineSnapshot(
        `"{"error":"Invalid API key","message":"The provided API key is not valid"}"`,
      );
    });

    it('should return an error when getting non-existing reindeer', async () => {
      const nonExistingReindeer = uuidv4();
      const response = await fetch(
        `${baseUrl}/reindeer/${nonExistingReindeer}`,
        {
          headers: { 'X-API-Key': INVALID_API_KEY },
        },
      );
      expect(response.status).toBe(403);
      const body = await response.text();
      expect(body).toMatchInlineSnapshot(
        `"{"error":"Invalid API key","message":"The provided API key is not valid"}"`,
      );
    });

    it('should return an error when trying to create an existing reindeer', async () => {
      const requestPayload = {
        name: 'Petar',
        color: ReindeerColor.Purple,
      };
      const response = await fetch(`${baseUrl}/reindeer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': INVALID_API_KEY,
        },
        body: JSON.stringify(requestPayload),
      });
      expect(response.status).toBe(403);
      const body = await response.text();
      expect(body).toMatchInlineSnapshot(
        `"{"error":"Invalid API key","message":"The provided API key is not valid"}"`,
      );
    });
  });

  describe('when omitting the API Key', () => {
    it('should return an error when getting a reindeer', async () => {
      const response = await fetch(
        `${baseUrl}/reindeer/40f9d24d-d3e0-4596-adc5-b4936ff84b19`,
      );
      expect(response.status).toBe(401);
      const body = await response.text();
      expect(body).toMatchInlineSnapshot(
        `"{"error":"API key is missing","message":"Please provide an API key using the 'X-API-Key' header"}"`,
      );
    });

    it('should return an error when getting non-existing reindeer', async () => {
      const nonExistingReindeer = uuidv4();
      const response = await fetch(
        `${baseUrl}/reindeer/${nonExistingReindeer}`,
      );
      expect(response.status).toBe(401);
      const body = await response.text();
      expect(body).toMatchInlineSnapshot(
        `"{"error":"API key is missing","message":"Please provide an API key using the 'X-API-Key' header"}"`,
      );
    });

    it('should return an error when trying to create an existing reindeer', async () => {
      const requestPayload = {
        name: 'Petar',
        color: ReindeerColor.Purple,
      };
      const response = await fetch(`${baseUrl}/reindeer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestPayload),
      });
      expect(response.status).toBe(401);
      const body = await response.text();
      expect(body).toMatchInlineSnapshot(
        `"{"error":"API key is missing","message":"Please provide an API key using the 'X-API-Key' header"}"`,
      );
    });
  });
});
