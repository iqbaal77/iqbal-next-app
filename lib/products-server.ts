import prisma from './prisma'
export default {
  async getById(id:number){
    return prisma.product.findUnique({ where: { id } })
  },
  async all(){
    return prisma.product.findMany({ orderBy: { id: 'asc' } })
  }
}
