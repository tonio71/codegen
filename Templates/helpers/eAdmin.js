
function eAdmin(req, res, next){
    if (req.isAuthenticated() && req.user.admin == 1){
        return next()
    }

    req.flash("error_msg","Voce precisa ser Admin !!!")
    res.redirect("/")
}

function eVender(req, res, next){
    console.log("===> Autenticado: "+ req.isAuthenticated() )
    console.log("===> req.user.admin: "+req.user.admin)
    if (req.isAuthenticated() && req.user.admin == 2){
        return next()
    }

    req.flash("error_msg","Voce precisa ser Vendedor !!!")
    res.redirect("/")
}



module.exports = { eAdmin, eVender}