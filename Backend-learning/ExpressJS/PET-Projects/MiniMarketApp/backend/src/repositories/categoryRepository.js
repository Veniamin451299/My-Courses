// path: backend/src/repositories/categoryRepository.js
const prisma = require('../config/prisma');

class CategoryRepository {
    // For GET all
    async findAll() {
        return prisma.category.findMany();
    };
    // For GET by id
    async findById(id) {
        return prisma.category.findUnique({ where: { id: id } });
    };
    // For POST create data
    async create(data) {
        return prisma.category.create({ data: data });
    };
    // For PUT update data
    async update(id, data) {
        return prisma.category.update({ where: { id: id }, data: data });
    };
    // For DELETE data
    async delete(id) {
        return prisma.category.delete({ where: { id: id } });
    };
}

module.exports = new CategoryRepository();