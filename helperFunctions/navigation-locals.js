/* User Locals Navigation Styling Class is to used to style the navigation items
*  This is to identify which section of the page we are at
*  To be used across all the user views in the page
*  If no url to the given path is found, default to 'Ginny Bradley' title
*  This will fix errors where the title is not found
*  Therefore, stopping the page of being render to the user or process a post instruction.
*  Beware that any modifications of this module,
*  Will implicitly indicate the need of changes in the
*  header.ejs and profile-nav.ejs file in the partials folder of the users
*/
class UserLocalsNavigationStyling {
    constructor(){}
    setLocals(req, res, next){
        res.locals.username =  req.user.first_name ?  req.user.first_name + " " + req.user.last_name : 'Hello User';
        res.locals.active = 'active';
        const url = req.url;
        switch(url){
            case "/": res.locals.title = 'Dashboard';
                break;
            case "/dashboard": res.locals.title = 'Dashboard';
                break;
            case "/create-user": res.locals.title = 'Create User';
                break;
            case "/edit-user": res.locals.title = 'Edit User';
                break;
            case "/create-page": res.locals.title = 'Create Page';
                break;
            case "/edit-page": res.locals.title = 'Edit Page';
                break;
            case "/profile": res.locals.title = 'Profile';
                break;
            case "/change-email-request": res.locals.title = 'Change Email';
                break;
            case "/change-password": res.locals.title = 'Change Password';
                break;
            case "/manage-nav": res.locals.title = 'Manage Navigation Items';
                break;
            case "/manage-pdfs": res.locals.title = 'Manage Files';
                break;
            case "/unknown": res.locals.title = '404 Not Found';
                break;
            default: res.locals.title = 'Ginny Bradley'
        }
        return next();
    }
}

module.exports = UserLocalsNavigationStyling;