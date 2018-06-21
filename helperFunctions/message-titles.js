/* MessageTitles Class
*  Enable us to define what kind of title the message will have
*  Therefore, this will help us to personalize our messages
*  Beware that any modifications of this module,
*  Will implicitly indicate the need of changes in the
*  delete-alert-message.ejs file in the partials folder of the users
*/
class MessageTitles {
    constructor(){}
    setMessageTitles(req, res, next){
        const url = req.url;
        switch(url){
            case "/": res.locals.messageTitle = 'Delete User';
                break;
            case "/dashboard": res.locals.messageTitle = 'Delete User';
                break;
            case "/manage-pdfs": res.locals.messageTitle = 'Delete PDF';
                break;
            case "/edit-page": res.locals.messageTitle = 'Delete Page';
                break;
            default: res.locals.messageTitle = 'You are about to delete this:';
        }
        return next();
    }
}

module.exports = MessageTitles;