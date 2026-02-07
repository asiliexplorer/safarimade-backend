"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserStore = void 0;
// auth.store.ts
const auth_model_1 = require("./auth.model");
exports.UserStore = {
    async create(user) {
        return await auth_model_1.UserModel.create(user);
    },
    async findByEmail(email) {
        return await auth_model_1.UserModel.findOne({ email });
    },
    async findById(id) {
        return await auth_model_1.UserModel.findById(id);
    },
    async findCompaniesByStatus(status) {
        return await auth_model_1.UserModel.find({ role: "company", companyStatus: status });
    },
    async update(id, patch) {
        return await auth_model_1.UserModel.findByIdAndUpdate(id, patch, { new: true });
    },
    // NEW: generic find with projection and pagination
    async findMany(filters = {}, projection = {}, options = {}) {
        const query = auth_model_1.UserModel.find(filters, projection).sort({ createdAt: -1 });
        if (options.skip)
            query.skip(options.skip);
        if (options.limit)
            query.limit(options.limit);
        return await query.exec();
    },
    // NEW: count matching docs
    async count(filters = {}) {
        return await auth_model_1.UserModel.countDocuments(filters);
    },
};
