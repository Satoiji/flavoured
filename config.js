module.exports = {
    port: process.env.PORT || 8080,
    db: process.env.MONGOURI || "mongodb+srv://g_herrera:gatoperro@flavoured-classics-dmotk.mongodb.net/URM_collection?retryWrites=true&w=majority",
    SECRET_TOKEN: 'SECRET_TOKEN'
}