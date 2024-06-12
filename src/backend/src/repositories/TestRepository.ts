import Repository from './Repository';

export class TestRepository extends Repository {
    public async listAll() {
        return this.doSelect(
            `SELECT * 
            FROM teste`,
        );
    }

    public async findById(id: number) {
        return this.doSelectOne(
            `SELECT * 
            FROM teste 
            WHERE 
                teste.id = ?`,
            [id],
        );
    }

    public async create(name: string) {
        return this.doCreate(
            `INSERT INTO teste 
                (name) 
            VALUES 
                (?)`,
            [name],
        );
    }

    public async updateById(id: number, name: string) {
        return this.doUpdate(
            `UPDATE teste 
                SET name = ?
            WHERE teste.id = ?`,
            [name, id],
        );
    }

    public async deleteById(id: number) {
        return this.doDelete(
            `DELETE FROM teste
            WHERE 
                teste.id = ?`,
            [id],
        );
    }
}

const testRepository = new TestRepository();
export default testRepository;
