// auth.store.ts
import { UserModel } from "./auth.model";

export const UserStore = {
  async create(user: any) {
    return await UserModel.create(user);
  },

  async findByEmail(email: string) {
    return await UserModel.findOne({ email });
  },

  async findById(id: string) {
    return await UserModel.findById(id);
  },

  async findCompaniesByStatus(status: string) {
    return await UserModel.find({ role: "company", companyStatus: status });
  },

  async update(id: string, patch: Partial<any>) {
    return await UserModel.findByIdAndUpdate(id, patch, { new: true });
  },

  // NEW: generic find with projection and pagination
  async findMany(filters: any = {}, projection: any = {}, options: { limit?: number; skip?: number } = {}) {
    const query = UserModel.find(filters, projection).sort({ createdAt: -1 });
    if (options.skip) query.skip(options.skip);
    if (options.limit) query.limit(options.limit);
    return await query.exec();
  },

  // NEW: count matching docs
  async count(filters: any = {}) {
    return await UserModel.countDocuments(filters);
  },
};
