import type { Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { v4 as uuidv4 } from 'uuid';
import { app } from '../src';
import { ReindeerColor } from '../src/types';

let server: Server;
let baseUrl: string;

beforeAll((done) => {
  server = app.listen(() => {
    const { port } = server.address() as AddressInfo;
    baseUrl = `http://localhost:${port}`;
    done();
  });
});

afterAll((done) => {
  server.close(done);
});

describe('Reindeer API', () => {
  it('should get a reindeer', async () => {
    const response = await fetch(
      `${baseUrl}/reindeer/40f9d24d-d3e0-4596-adc5-b4936ff84b19`,
    );
    expect(response.status).toBe(200);
    const body = await response.text();
    expect(body).toMatchInlineSnapshot(
      `"{"id":"40f9d24d-d3e0-4596-adc5-b4936ff84b19","name":"Petar","color":1}"`,
    );
  });

  it('should return not found for non-existing reindeer', async () => {
    const nonExistingReindeer = uuidv4();
    const response = await fetch(`${baseUrl}/reindeer/${nonExistingReindeer}`);
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
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestPayload),
    });
    expect(response.status).toBe(409);
    const body = await response.text();
    expect(body).toMatchInlineSnapshot(`"Reindeer already exists"`);
  });
});
