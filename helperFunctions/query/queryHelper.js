const {pool} = require('../../server/db/database');
const squel = require('squel').useFlavour('postgres')




const queryHelper = (query, values) => {
  return new Promise((resolve, reject) => {
    return pool.query(query, values)
      .then(res => resolve(res.rows))
      .catch(e => reject(e))
  })
}



const queryUnique = (text, values) => {
  return queryHelper(text, values)
    .then(rows => {
      if (rows.length === 0) {
        return Promise.reject(new Error('not found'));
      }
      return rows[0];
    })
    .catch(e => e.message);
}


const findByUsername = (table, email) => {
  return queryUnique(`select exists(select 1 from users where email=('${email}'))`, ).then(res => {
    if (!res.exists) return false
    return queryUnique(`select * from users where email = '${email}'`)
      .then(user => user)
  }).catch(e => e.message)
}


const insertOne = (table, values) => {
  query = squel.insert()
    .into(table)
    .setFieldsRows([values])
    .returning('*')
    .toParam()
  return queryUnique(query.text, query.values)
}

const insertMany = (table, values) => {
  query = squel.insert()
    .into(table)
    .setFieldsRows(values)
    .returning('*')
    .toParam()
  if (values instanceof Array) {
    (values.length === 0) ? Promise.resolve(values): (
      queryHelper(query.text, query.values)
      .then(row => rows)
      .catch(e => e)
    )
  }
}

const update = (table, condition, values) => {
  const query = squel.update()
    .table(tableName)
    .setFields(values)
    .where(condition[0], condition[1])
    .returning('*')
    .toParam()
  return queryHelper(query.text, query.values);
}

const updateOne = (table, condition, values) => {
  return update(table, condition, values)
    .then(rows => {
      if (rows.length === 0) {
        return Promise.reject(new Error('not found'))
      }
    })
}

//refactor findby to recieve config
const findBy = (table, condition) => {
  const query = squel.select()
    .from(table)
    .field('*')
    .where(condition)
    .toParam()
  return queryHelper(query.text, query.values);
}


const findOne = (table, condition) => {
  const query = squel.select()
    .from(table)
    .field('*')
    .where(condition)
    .toParam()
  return queryUnique(query.text, query.values);
}


module.exports = {
  queryHelper,
  queryUnique,
  insertOne,
  insertMany,
  update,
  updateOne,
  findBy,
  findOne,
  findByUsername
};