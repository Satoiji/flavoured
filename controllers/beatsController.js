function index(req, res){
    res.render('beats/index');
}

function profile(req, res){
    res.status(200).send({message: 'acceso'});
}

module.exports = {
    index,
    profile
}