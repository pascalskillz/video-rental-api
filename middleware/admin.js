module.exports = function (req, res, next) {
    //this middleware funtio will be executed after the authorization middleware
    //401 Unauthorized - invalid jsonwebtoken
    //403 Forbidden - don't have permission
    if (!req.user.isAdmin) return res.status(403).send('Access denied')

    next()
}