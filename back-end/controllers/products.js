const Categories = require("../models/categories");
const Products = require("../models/products");
const Users = require("../models/users");
const mongoose = require("mongoose");

/**
 * by categories paginated result
 * @param {*} req
 * @param {*} res
 */
const NUM_LEVELS = 4;
const getAllLevels = (n) => {
    let levels = {};
    for (let i = 1; i <= n; i++) {
        levels[`L${i}`] = 1;
    }
    return levels;
};
const getLevel = (nth) => `L${nth}`;
let PAGE_SIZE = 20;

module.exports.getByCategoryInPages = (req, res) => {
    const {
        category,
        page,
        size
    } = req.params;
    let pageSize = PAGE_SIZE;
    let $size = parseInt(size);
    let $page = parseInt(page);
    if (size && $size !== NaN) {
        pageSize = $size;
    }

    (function getCategories(categories, id, getProducts, RCount) {
        RCount = RCount || {
            count: 1,
        };
        RCount.count++;
        Categories.find({
                parent: id,
            }, {
                _id: 1,
                ...getAllLevels(NUM_LEVELS),
            })
            .then((result) => {
                RCount.count--;
                for (let r of result) {
                    if (r[getLevel(NUM_LEVELS)] === undefined)
                        getCategories(categories, r._id, getProducts, RCount);
                    else if (r._id) categories.push(mongoose.Types.ObjectId(r._id));
                }
                categories.push(mongoose.Types.ObjectId(id));
            })
            .finally(() => {
                if (RCount.count === 1) {
                    if (typeof getProducts === "function") getProducts(categories);
                }
            });
    })([], category, getProducts);

    function getProducts(categories) {
        Products.count({
                category: {
                    $in: categories,
                },
            },
            (err, count) => {
                if (err) {
                    res.json({
                        isOK: false,
                        error: err,
                    });
                } else {
                    Products.aggregate([{
                            $match: {
                                category: {
                                    $in: categories,
                                },
                            },
                        }, {
                            $skip: pageSize * ($page - 1),
                        }, {
                            $limit: pageSize,
                        }, {
                            $project: {
                                title: 1,
                                _id: 1,
                                price: 1,
                                product_images: {
                                    250: 1,
                                },
                                merchant_id: 1,
                            },
                        }, {
                            $lookup: {
                                from: "users",
                                // localField: "merchant_id",
                                // foreignField: "_id",
                                let: {
                                    id: "$merchant_id",
                                },
                                pipeline: [{
                                    $match: {
                                        $expr: {
                                            $eq: ["$$id", "$_id"],
                                        },
                                    },
                                }, {
                                    $project: {
                                        business_info: {
                                            businessName: 1,
                                        },
                                        _id: 1,
                                        images: {
                                            profile_pic: {
                                                250: 1,
                                            },
                                        },
                                    },
                                }, ],
                                as: "merchant",
                            },
                        }, {
                            $unwind: "$merchant",
                        },

                        {
                            $project: {
                                title: 1,
                                _id: 1,
                                price: 1,
                                product_images: {
                                    250: 1,
                                },
                                merchant: 1,
                            },
                        },
                    ])

                    // Products
                    //     .find({ category: { $in: categories } }, { merchant_id: 1, title: 1, _id: 1, product_images: { "250": 1 } })
                    //     .limit(pageSize)
                    //     .skip(pageSize * ($page - 1))
                    //     .populate("merchant_id", {
                    //         business_info: { businessName: 1 }, _id: 1, images: {
                    //             profile_pic: {

                    //                 "250": 1
                    //             }
                    //         }
                    //     })
                    .exec()
                        .then((result) => {
                            let pages = Math.ceil(Number(count / pageSize));
                            if (!pages && count > 0) {
                                pages = 1;
                            }
                            res.json({
                                isOK: true,
                                data: result,
                                meta: {
                                    totalPages: pages,
                                    size: pageSize,
                                    count: count,
                                    page: $page,
                                },
                            });
                        })
                        .catch((err) => {
                            res.json({
                                isOK: false,
                                error: err,
                            });
                        });
                }
            }
        );
    }
};
module.exports.getByProductId = (req, res) => {
    Products.aggregate([{
                $match: {
                    _id: new mongoose.Types.ObjectId(req.params.id),
                },
            }, {
                $project: {
                    title: 1,
                    _id: 1,
                    price: 1,
                    sku: 1,
                    description: 1,
                    product_images: {
                        250: 1,
                        700: 1,
                    },
                    merchant_id: 1,
                },
            }, {
                $lookup: {
                    from: "users",
                    // localField: "merchant_id",
                    // foreignField: "_id",
                    let: {
                        id: "$merchant_id",
                    },
                    pipeline: [{
                        $match: {
                            $expr: {
                                $eq: ["$$id", "$_id"],
                            },
                        },
                    }, {
                        $project: {
                            business_info: {
                                businessName: 1,
                            },
                            _id: 1,
                            location: 1,
                            business_name: 1,
                            profileCompletion: 1,
                            images: {
                                profile_pic: {
                                    250: 1,
                                },
                            },
                        },
                    }, ],
                    as: "merchant",
                },
            }, {
                $unwind: "$merchant",
            },

            {
                $project: {
                    title: 1,
                    _id: 1,
                    price: 1,
                    sku: 1,
                    description: 1,
                    product_images: {
                        250: 1,
                        700: 1,
                    },
                    merchant: 1,
                },
            },
        ])
        .exec()
        .then((result) => {
            // console.log(`result`, result);
            res.json({
                isOK: true,
                data: result,
            });
        })
        .catch((err) => {
            res.json({
                isOK: false,
                error: err.message,
            });
        });
};

module.exports.getByCategory = (req, res) => {
    const {
        category
    } = req.params;
    (function getCategories(categories, id, getProducts, RCount) {
        RCount = RCount || {
            count: 1,
        };
        RCount.count++;
        Categories.find({
                parent: id,
            }, {
                _id: 1,
                ...getAllLevels(NUM_LEVELS),
            })
            .then((result) => {
                RCount.count--;
                for (let r of result) {
                    if (r[getLevel(NUM_LEVELS)] === undefined)
                        getCategories(categories, r._id, getProducts, RCount);
                    else if (r._id) categories.push(mongoose.Types.ObjectId(r._id));
                }
                categories.push(mongoose.Types.ObjectId(id));
            })
            .finally(() => {
                if (RCount.count === 1) {
                    if (typeof getProducts === "function") getProducts(categories);
                }
            });
    })([], category, getProducts);

    function getProducts(categories) {
        Products.count({
                category: {
                    $in: categories,
                },
            },
            (err, count) => {
                if (err) {
                    res.json({
                        isOK: false,
                        error: err,
                    });
                } else {
                    Products.aggregate([{
                            $match: {
                                category: {
                                    $in: categories,
                                },
                            },
                        }, {
                            $project: {
                                title: 1,
                                _id: 1,
                                price: 1,
                                product_images: 1,
                                merchant_id: 1,
                            },
                        }, {
                            $lookup: {
                                from: "users",
                                // localField: "merchant_id",
                                // foreignField: "_id",
                                let: {
                                    id: "$merchant_id",
                                },
                                pipeline: [{
                                    $match: {
                                        $expr: {
                                            $eq: ["$$id", "$_id"],
                                        },
                                    },
                                }, {
                                    $project: {
                                        business_info: {
                                            businessName: 1,
                                        },
                                        _id: 1,
                                        images: {
                                            profile_pic: {
                                                250: 1,
                                            },
                                        },
                                    },
                                }, ],
                                as: "merchant",
                            },
                        }, {
                            $unwind: "$merchant",
                        }, {
                            $project: {
                                title: 1,
                                _id: 1,
                                price: 1,
                                product_images: {
                                    250: 1,
                                },
                                merchant: 1,
                            },
                        }, ])
                        // Products
                        //     .find({ category: { $in: categories } }, { merchant_id: 1, title: 1, _id: 1, product_images: { "250": 1 } })
                        //     .limit(pageSize)
                        //     .skip(pageSize * ($page - 1))
                        //     .populate("merchant_id", {
                        //         business_info: { businessName: 1 }, _id: 1, images: {
                        //             profile_pic: {
                        //                 "250": 1
                        //             }
                        //         }
                        //     })
                        .exec()
                        .then((result) => {
                            res.json({
                                isOK: true,
                                data: result,
                            });
                        })
                        .catch((err) => {
                            res.json({
                                isOK: false,
                                error: err,
                            });
                        });
                }
            }
        );
    }
};