const { Client } = require('pg');
const uuid = require('uuid');
const client = new Client('postgres://localhost/acme_posts_comments');
client.connect();

const generateIds = (...names) => {
  return names.reduce((acc, name) => {
    acc[name] = uuid.v4();
    return acc;
  }, {});
};

const ids = generateIds('node', 'express', 'react', 'tag1', 'tag2', 'tag3');

const SQL = `
  DROP TABLE IF EXISTS tags;
  DROP TABLE IF EXISTS posts;

  CREATE TABLE posts(
    id UUID PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
  );

  CREATE TABLE tags(
    id UUID PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    bio TEXT,
    posts_id UUID references posts(id)
  );

  INSERT INTO posts(id, name) values('${ids.node}', 'Node');
  INSERT INTO posts(id, name) values('${ids.express}', 'Express');
  INSERT INTO posts(id, name) values('${ids.react}', 'React');

  INSERT INTO tags(id, name, posts_id) values('${ids.tag1}', 'node', '${ids.node}');
  INSERT INTO tags(id, name, posts_id, bio) values('${ids.tag2}', 'express', '${ids.express}', 'Challenging');
  INSERT INTO tags(id, name, posts_id, bio) values('${ids.tag3}', 'react', '${ids.react}', 'Loved it');

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
  const response = await client.query('Select * FROM tags;');
  return response.rows;
}

const findAllPosts = async () => {
  const response = await client.query('Select * FROM posts;');
  return response.rows;
}

module.exports = {
  syncAndSeed,
  findAllTags,
  findAllPosts
}