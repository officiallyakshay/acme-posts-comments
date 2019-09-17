const { Client } = require('pg');
const uuid = require('uuid');
const faker = require('faker');
const client = new Client('postgres://localhost/acme-posts-comments');
client.connect();

const generateIds = (...names) => {
  return names.reduce((acc, name) => {
    acc[name] = uuid.v4();
    return acc;
  }, {});
};

const ids = generateIds('moe', 'larry', 'curly', 'shep', 'lucy', 'it', 'marketing', 'hr', 'sales', 'usersWithNoDepartments');

const SQL = `
  DROP TABLE IF EXISTS users;
  DROP TABLE IF EXISTS departments;

  CREATE TABLE departments(
    id UUID PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
  );

  CREATE TABLE users(
    id UUID PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    bio TEXT,
    department_id UUID references departments(id)
  );

  INSERT INTO departments(id, name) values('${ids.hr}', 'HR');
  INSERT INTO departments(id, name) values('${ids.sales}', 'Sales');
  INSERT INTO departments(id, name) values('${ids.marketing}', 'Marketing');
  INSERT INTO departments(id, name) values('${ids.it}', 'IT');

  INSERT INTO users(id, name, department_id, bio) values('${ids.moe}', 'moe', '${ids.hr}', '${faker.lorem.paragraph(2)}');
  INSERT INTO users(id, name, department_id, bio) values('${ids.larry}', 'larry', '${ids.hr}', '${faker.lorem.paragraph(2)}');
  INSERT INTO users(id, name, department_id, bio) values('${ids.curly}', 'curly', '${ids.sales}', '${faker.lorem.paragraph(2)}');
  INSERT INTO users(id, name, department_id, bio) values('${ids.lucy}', 'lucy', '${ids.it}', '${faker.lorem.paragraph(2)}');
  INSERT INTO users(id, name, department_id, bio) values('${ids.shep}', 'shep', '${faker.lorem.paragraph(2)}');

`

const syncAndSeed = async () => {
  try {
    await client.query(SQL);
  }
  catch(ex) {
    console.log(ex.message);
  }
}

const findAllTags = async () => {
  const response = await client.query('Select * FROM users;');
  return response.rows;
}

const findAllPosts = async () => {
  const response = await client.query('Select * FROM departments;');
  return response.rows;
}

module.exports = {
  syncAndSeed,
  findAllTags,
  findAllPosts
}