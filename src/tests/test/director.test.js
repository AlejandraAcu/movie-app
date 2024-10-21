require('../../models');
const request = require('supertest');
const app = require('../../app');

const BASE_URL = '/api/v1/directors';

const directors = {
	firstName: 'Gore',
	lastName: 'Verbinski ',
	nationality: 'United States',
	image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Gore_Verbinski_1.JPG/390px-Gore_Verbinski_1.JPG',
	birthday: '1964-03-16',
};

const directorUpdate = {
	firstName: 'Joachim',
    lastName: 'Rønning',
    nationality: 'Norway',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Joachim_R%C3%B8nning_Funweek.it_2024.png/330px-Joachim_R%C3%B8nning_Funweek.it_2024.png',
    birthday: '1972-05-30',
};

let directorId;

test("POST-> 'BASE_URL' should return status code 201 and res.body.firstName to be directors.firstName", async () => {
	const res = await request(app)
		.post(BASE_URL)
		.send(directors);

	directorId = res.body.id;

	expect(res.status).toBe(201);
	expect(res.body).toBeDefined();
	expect(res.body.firstName).toBe(directors.firstName);
});

test("GET-> 'BASE_URL' should return status code 200 and res.body to have length === 1", async () => {
	const res = await request(app)
		.get(BASE_URL);

	expect(res.status).toBe(200);
	expect(res.body).toBeDefined();
	expect(res.body).toHaveLength(1);

	expect(res.body[0].movies).toBeDefined();
	expect(res.body[0].movies).toHaveLength(0);
});

test("GET-> 'BASE_URL/:id' should return status code 200 and res.body.firstName to be directors.firstName", async () => {
	const res = await request(app)
		.get(`${BASE_URL}/${directorId}`);

	expect(res.status).toBe(200);
	expect(res.body).toBeDefined();
	expect(res.body.firstName).toBe(directors.firstName);
	expect(res.body.id).toBe(directorId);

	expect(res.body.movies).toBeDefined();
	expect(res.body.movies).toHaveLength(0);
});

test("PUT-> 'BASE_URL/:id' should return status code 200 and res.body.firstName to be directorUpdate.firstName", async () => {
	const res = await request(app)
		.put(`${BASE_URL}/${directorId}`)
		.send(directorUpdate);

	expect(res.status).toBe(200);
	expect(res.body).toBeDefined();
	expect(res.body.firstName).toBe(directorUpdate.firstName);
	expect(res.body.id).toBe(directorId);
});

test("DELETE-> 'BASE_URL/:id' should return status code 204", async () => {
	const res = await request(app)
		.delete(`${BASE_URL}/${directorId}`);

	expect(res.status).toBe(204);
});