require('../../models');
const request = require('supertest');
const app = require('../../app');

let actorId, directorId, genreId;

beforeAll(async () => {
	const actors = {
		firstName: 'Johnny ',
	    lastName: 'Depp',
	    nationality: 'United States',
	    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Johnny_Depp_2020.jpg/330px-Johnny_Depp_2020.jpg',
	    birthday: '1963-06-09',
	};

	const directors = {
		firstName: 'Gore',
	    lastName: 'Verbinski ',
	    nationality: 'United States',
	    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Gore_Verbinski_1.JPG/390px-Gore_Verbinski_1.JPG',
	    birthday: '1964-03-16',
	};

	const genres = {
		name: 'Comedy',
	};

	const actorRes = await request(app).post('/api/v1/actors').send(actors);

	actorId = actorRes.body.id;

	const directorRes = await request(app).post('/api/v1/directors').send(directors);

	directorId = directorRes.body.id;

	const genreRes = await request(app).post('/api/v1/genres').send(genres);

	genreId = genreRes.body.id;
});

afterAll(async () => {
	await request(app).delete(`/api/v1/actors/${actorId}`);

	await request(app).delete(`/api/v1/directors/${directorId}`);

	await request(app).delete(`/api/v1/genres/${genreId}`);
});

const BASE_URL = '/api/v1/movies';

const movies = {
	name: 'Pirates of the Caribbean',
	image: 'https://1.bp.blogspot.com/-ur7eDTTL56c/Xsb76N5Ms0I/AAAAAAAAAUM/8mgapPxJNu0HvmeZhWJ72FtGkrrdescjgCK4BGAsYHg/w1200-h630-p-k-no-nu/Jack_Sparrow_OST_Textless_Poster.jpg',
	synopsis: 'It is loosely based on myths and legends of the seas, such as the pirate Davy Jones and his ghostly crew aboard The Flying Dutchman',
	releaseYear: 2017,
};

const movieUpdate = {
	name: 'Pirates of the Caribbean 2: Dead Mans Chest',
};

let movieId;

test("POST-> 'BASE_URL' should return status code 201 and res.body.name to be movies.name", async () => {
	const res = await request(app).post(BASE_URL).send(movies);

	movieId = res.body.id;

	expect(res.status).toBe(201);
	expect(res.body).toBeDefined();
	expect(res.body.name).toBe(movies.name);
});

test("GET-> 'BASE_URL' should return status code 200 and res.body to have length === 1", async () => {
	const res = await request(app).get(BASE_URL);

	expect(res.status).toBe(200);
	expect(res.body).toBeDefined();
	expect(res.body).toHaveLength(1);

	expect(res.body[0].actors).toBeDefined();
	expect(res.body[0].actors).toHaveLength(0);

	expect(res.body[0].directors).toBeDefined();
	expect(res.body[0].directors).toHaveLength(0);

	expect(res.body[0].genres).toBeDefined();
	expect(res.body[0].genres).toHaveLength(0);
});

test("GET-> 'BASE_URL/:id' should return status code 200 and res.body.name to be movies.name", async () => {
	const res = await request(app).get(`${BASE_URL}/${movieId}`);

	expect(res.status).toBe(200);
	expect(res.body).toBeDefined();
	expect(res.body.name).toBe(movies.name);
	expect(res.body.id).toBe(movieId);

	expect(res.body.actors).toBeDefined();
	expect(res.body.actors).toHaveLength(0);

	expect(res.body.directors).toBeDefined();
	expect(res.body.directors).toHaveLength(0);

	expect(res.body.genres).toBeDefined();
	expect(res.body.genres).toHaveLength(0);
});

test("PUT-> 'BASE_URL/:id' should return status code 200 and res.body.name to be movieUpdate.name", async () => {
	const res = await request(app).put(`${BASE_URL}/${movieId}`).send(movieUpdate);

	expect(res.status).toBe(200);
	expect(res.body).toBeDefined();
	expect(res.body.name).toBe(movieUpdate.name);
	expect(res.body.id).toBe(movieId);
});

//movieActor test
test("POST-> 'BASE_URL/:id/actors' should return status code 200 and res.body to be defined", async () => {
	const res = await request(app).post(`${BASE_URL}/${movieId}/actors`).send([actorId]);

	expect(res.status).toBe(200);
	expect(res.body).toBeDefined();
	expect(res.body).toHaveLength(1);

	expect(res.body[0].id).toBeDefined();
	expect(res.body[0].id).toBe(actorId);

	expect(res.body[0].movieActor.actorId).toBeDefined();
	expect(res.body[0].movieActor.actorId).toBe(actorId);
});
//movieDirector test
test("POST-> 'BASE_URL/:id/directors' should return status code 200 and res.body to be defined", async () => {
	const res = await request(app).post(`${BASE_URL}/${movieId}/directors`).send([directorId]);

	expect(res.status).toBe(200);
	expect(res.body).toBeDefined();
	expect(res.body).toHaveLength(1);

	expect(res.body[0].id).toBeDefined();
	expect(res.body[0].id).toBe(directorId);

	expect(res.body[0].movieDirector.directorId).toBeDefined();
	expect(res.body[0].movieDirector.directorId).toBe(directorId);
});
//movieGenre test
test("POST-> 'BASE_URL/:id/genres' should return status code 200 and res.body to be defined", async () => {
	const res = await request(app).post(`${BASE_URL}/${movieId}/genres`).send([genreId]);

	expect(res.status).toBe(200);
	expect(res.body).toBeDefined();
	expect(res.body).toHaveLength(1);

	expect(res.body[0].id).toBeDefined();
	expect(res.body[0].id).toBe(genreId);

	expect(res.body[0].movieGenre.genreId).toBeDefined();
	expect(res.body[0].movieGenre.genreId).toBe(genreId);
});

test("DELETE-> 'BASE_URL/:id' should return status code 204", async () => {
	const res = await request(app).delete(`${BASE_URL}/${movieId}`);

	expect(res.status).toBe(204);
});