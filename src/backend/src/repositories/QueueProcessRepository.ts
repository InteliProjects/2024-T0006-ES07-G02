import Repository from './Repository';

export class QueueProcess extends Repository {
    public async listAll() {
        return this.doSelect(
            `SELECT * 
            FROM queue_process`,
        );
    }

    public async findById(id: number) {
        return this.doSelectOne(
            `SELECT * 
            FROM queue_process 
            WHERE 
                queue_process.id = ?`,
            [id],
        );
    }

    public async create(queue: string, status: string, relationId: number, finishedAt?: Date) {
        return this.doCreate(
            `INSERT INTO queue_process 
                (queue, relation_id, status, finished_at) 
            VALUES 
                (?, ?, ?, ?)`,
            [queue, relationId, status, finishedAt],
        );
    }

    public async updateLastByQueueNRelation(relationId: number, queue: string, status: string, finishedAt?: Date) {
        return this.doUpdate(
            `UPDATE queue_process
                INNER JOIN (
                    SELECT qp.id
                    FROM queue_process AS qp
                    WHERE qp.relation_id = ?
                        AND qp.queue = ?
                    ORDER BY id DESC
                    LIMIT 1
                ) AS q2 ON q2.id = queue_process.id
            SET status = ?,
                finished_at = ?`,
            [relationId, queue, status, finishedAt],
        );
    }

    public async updateById(
        id: number,
        updateInfo: { queue?: string; status?: string; finishedAt?: Date; relationId?: number },
    ) {
        if (!Object.keys(updateInfo)) {
            return false;
        }

        const updateObj: Record<string, any> = {};

        if (updateInfo.finishedAt) {
            updateObj.finished_at = updateInfo.finishedAt;
        }

        if (updateInfo.queue) {
            updateObj.queue = updateInfo.queue;
        }

        if (updateInfo.relationId) {
            updateObj.relation_id = updateInfo.relationId;
        }

        if (updateInfo.status) {
            updateObj.status = updateInfo.status;
        }

        const values = Object.values(updateObj);
        values.push(id);

        return this.doUpdate(
            `UPDATE queue_process 
                SET ${Object.keys(updateObj)
                    .map((value: string) => {
                        return `${value} = ?`;
                    })
                    .join(', ')}
            WHERE queue_process.id = ?`,
            values,
        );
    }

    public async deleteById(id: number) {
        return this.doDelete(
            `DELETE FROM queue_process
            WHERE 
                queue_process.id = ?`,
            [id],
        );
    }
}

const queueProcessRepository = new QueueProcess();
export default queueProcessRepository;
