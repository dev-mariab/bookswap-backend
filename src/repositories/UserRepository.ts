import { Usuario } from '../models/Usuario';

export interface IUserRepository {
  findAll(): Promise<Usuario[]>;
  findById(id: string): Promise<Usuario | null>;
  findByEmail(email: string): Promise<Usuario | null>;
  create(data: Partial<Usuario>): Promise<Usuario>;
  update(id: string, data: Partial<Usuario>): Promise<Usuario | null>;
  delete(id: string): Promise<boolean>;
}

export class UserRepository implements IUserRepository {
  async findAll(): Promise<Usuario[]> {
    return Usuario.findAll();
  }

  async findById(id: string): Promise<Usuario | null> {
    return Usuario.findByPk(id);
  }

  async findByEmail(email: string): Promise<Usuario | null> {
    return Usuario.findOne({ where: { email } });
  }

  async create(data: Partial<Usuario>): Promise<Usuario> {
    return Usuario.create(data as any);
  }

  async update(id: string, data: Partial<Usuario>): Promise<Usuario | null> {
    const user = await Usuario.findByPk(id);
    if (!user) return null;
    return user.update(data);
  }

  async delete(id: string): Promise<boolean> {
    const deleted = await Usuario.destroy({ where: { id } });
    return deleted > 0;
  }
}
