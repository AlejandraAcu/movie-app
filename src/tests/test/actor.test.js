require('../../models');
const request = require('supertest');
const app = require('../../app');

const BASE_URL = '/api/v1/actors';

const actors = {
	firstName: 'Johnny ',
	lastName: 'Depp',
	nationality: 'United States',
	image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Johnny_Depp_2020.jpg/330px-Johnny_Depp_2020.jpg',
	birthday: '1963-06-09',
};

let actorId;

const actorUpdate = {
	firstName: 'Christopher ',
};

test("POST-> 'BASE_URL' should return status code 201 and res.body.firstName to be actors.firstName", async () => {
	const res = await request(app)
		.post(BASE_URL)
		.send(actors);

	actorId = res.body.id;

	expect(res.status).toBe(201);
	expect(res.body).toBeDefined();
	expect(res.body.firstName).toBe(actors.firstName);
});

test("GET-> 'BASE_URL' should return status code 200 and res.body has to have length === 1", async () => {
	const res = await request(app)
		.get(BASE_URL);
	
	expect(res.status).toBe(200);
	expect(res.body).toBeDefined();
	expect(res.body).toHaveLength(1);

	expect(res.body[0].movies).toBeDefined();
	expect(res.body[0].movies).toHaveLength(0);
});

test("GET-> 'BASE_URL/:id' should return status code 200 and res.body.firstName to be actors.firstName", async () => {
	const res = await request(app)
		.get(`${BASE_URL}/${actorId}`);

	expect(res.status).toBe(200);
	expect(res.body).toBeDefined();
	expect(res.body.firstName).toBe(actors.firstName);
	expect(res.body.id).toBe(actorId);

	expect(res.body.movies).toBeDefined();
	expect(res.body.movies).toHaveLength(0);
});

test("PUT-> 'BASE_URL/:id' should return status code 200 and res.body.firstName to be actorUpdate.firstName", async () => {
	const res = await request(app)
		.put(`${BASE_URL}/${actorId}`)
		.send(actorUpdate);

	expect(res.status).toBe(200);
	expect(res.body).toBeDefined();
	expect(res.body.firstName).toBe(actorUpdate.firstName);
	expect(res.body.id).toBe(actorId);
});

test("DELETE-> 'BASE_URL/:id' should return status code 204", async () => {
	const res = await request(app)
		.delete(`${BASE_URL}/${actorId}`);

	expect(res.status).toBe(204);
});