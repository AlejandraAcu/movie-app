require('../models');
const sequelize = require('../utils/connection');

const testMigrate = async () => {
	try {
		sequelize.sync({ force: true });
		console.log('Database Reset 👍✅');
	} catch (error) {
		console.log(error);
	}
};

testMigrate();