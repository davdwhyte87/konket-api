"use strict";

var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: Number, required: true },
    password: { type: String, required: true },
    confirmed: { type: Boolean, required: true, default: false },
    code: { type: Number, required: true },
    created_at: Date
});

module.exports = mongoose.model("User", userSchema);
//# sourceMappingURL=User.js.map