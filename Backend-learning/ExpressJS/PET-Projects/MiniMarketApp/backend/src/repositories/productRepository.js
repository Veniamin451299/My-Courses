// path: backend/src/repositories/productRepository.js
const prisma = require('../config/prisma');

class ProductRepository {
  async findAll({ skip, take, where, orderBy }) {
    return prisma.product.findMany({ skip, take, where, orderBy });
  }

  async count(where) {
    return prisma.product.count({ where });
  }

  async findById(id) {
    return prisma.product.findUnique({ where: { id: id   } });
  }

  async create(data) {
    return prisma.product.create({ data: data });
  }

  async update(id, data) {
    return prisma.product.update({ where: { id: id }, data: data });
  }

  async delete(id) {
    return prisma.product.delete({ where: { id: id } });
  }
}

module.exports = new ProductRepository();