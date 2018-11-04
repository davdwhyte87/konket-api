'use strict';

var Contact = require('../models/Contact');
var mongoose = require('mongoose');

exports.add = function (req, res) {
    var user_id = req.userData.userId;
    Contact.find({ email: req.body.email, phone: req.body.phone }).exec().then(function (contact) {
        if (contact.length > 0) {
            return res.status(200).json({ code: 0, message: "This contact already exists" });
        }
        var contact = Contact({
            _id: new mongoose.Types.ObjectId(),
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            user: user_id
        });
        contact.save().then(function (contact) {
            res.status(200).json({ code: 1, message: "Contact added successfully", data: contact });
        }).catch(function (error) {
            console.log(error);
            res.status(500).json({ code: 0, message: "An error occurred", error: error });
        });
    }).catch(function (error) {
        console.log(error);
        res.status(500).json({ code: 0, message: "An error occured", error: error });
    });
};

exports.contact = function (req, res) {
    var user_id = req.userData.userId;
    Contact.find({ user: user_id }).exec().then(function (contacts) {
        return res.status(200).json({ code: 1, data: contacts });
    }).catch(function (error) {
        console.log(error);
        return res.status(500).json({ code: 0, message: "An error n occured" });
    });
};

exports.edit = function (req, res) {
    var c_id = req.params.id;
    var user_id = req.userData.userId;
    Contact.updateOne({ _id: c_id, user: user_id }, { $set: {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone
        } }).exec().then(function (contact) {
        console.log(contact);
        return res.status(200).json({ code: 1, message: "Conatact data updated" });
    }).catch(function (erro) {
        console.log(erro);
        return res.status(500).json({ code: 0, message: "An error occurred", error: erro });
    });
};
//# sourceMappingURL=contact.js.map