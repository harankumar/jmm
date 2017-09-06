module.exports = {
    mangleIdentifier
};

function mangleIdentifier(identifier){
    return "__js__" + identifier;
}