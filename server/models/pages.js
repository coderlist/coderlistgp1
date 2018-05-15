const {pool} = require('./../db/database');

/**
 * exports all pages database query functions
 * createPage, updatePage
 */

module.exports = {
    createPage(req, res) {
        const createQuery = `INSERT INTO pages \
                            (created_By,page_Title) \
                             VALUES ('${req.body.created_By}','${req.body.page_Title}')`;
        pool.connect()
            .then(client => {
                return client.query(createQuery)
                    .then(result => {
                        client.release();
                        res.status(200).send({
                            message: 'Page created',
                            response: result.rows
                        })
                    })
            })
            .catch(e => {
                res.status(400).send(e.stack)
            })
    }
}