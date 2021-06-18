const Categories = require("../models/categories")

module.exports.getAll = (req, res, next) => {
    Categories.find({}, {
        _id: 1, name: 1, productCount: 1,
        parent: 1
    }).then(result => {
        res.json(result)
    }).catch(err => res.json(err))
}

module.exports.getByLevel = (req, res, next) => {
    const Q = {
        [`L${req.params.level}`]: { $ne: null },
        [`L${Number(req.params.level) + 1}`]: null
    }
    Categories.find(Q).then(result => {
        res.json(result)
    }).catch(err => res.json(err))
}

module.exports.getByParent = (req, res, next) => {
    const Q = {
        parent: req.params.parentId
    }
    Categories.find(Q).then(result => {
        res.json(result)
    }).catch(err => res.json(err))
}