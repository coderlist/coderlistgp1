const {queryHelper} = require('../../helperFunctions/queryHelper');

/**
 * exports all pages database query functions
 * using queryHelper function 
 */

module.exports = {
    createPage(req, res){
        console.log('creating')
        const query = `INSERT INTO pages \
                      (created_by,page_title) \
                     VALUES ('${req.body.created_by}',\
                     '${req.body.page_title}')`;
        
        queryHelper(query).then((data)=>{
            res.status(200).send({
                message: 'Page Created',
                response: data.rows
            })
        }).catch(e => res.status(400).send(e.stack))
    }
}

