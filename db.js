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
    topic VARCHAR(255) UNIQUE NOT NULL
  );

  CREATE TABLE tags(
    id UUID PRIMARY KEY,
    text VARCHAR(255) UNIQUE NOT NULL,
    post_id UUID references posts(id)
  );

  INSERT INTO posts(id, topic) values('${ids.node}', 'node');
  INSERT INTO posts(id, topic) values('${ids.express}', 'express');
  INSERT INTO posts(id, topic) values('${ids.react}', 'react');

  INSERT INTO tags(id, text, post_id) values('${ids.tag2}', 'Challenging', '${ids.express}');
  INSERT INTO tags(id, text, post_id) values('${ids.tag3}', 'Loved it', '${ids.react}');

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