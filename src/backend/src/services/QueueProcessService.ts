import queueProcessRepository from '../repositories/QueueProcessRepository';

type IStatus = 'CREATED' | 'PROCESSING' | 'FINISHED' | 'ERROR';
type IQueue = 'transcription' | 'get_metrics';

export class QueueProcessService {
    public async listAll() {
        return queueProcessRepository.listAll();
    }

    public async findById(id: number) {
        return queueProcessRepository.findById(id);
    }

    public async create(queue: IQueue, relation_id: number, status: IStatus) {
        let finishedAt = undefined;

        if (status == 'FINISHED' || status == 'ERROR') {
            finishedAt = new Date();
        }

        return queueProcessRepository.create(queue, status, relation_id, finishedAt);
    }

    public async updateLastByQueueNRelation(relationId: number, queue: string, status: IStatus) {
        let finishedAt = undefined;

        if (status == 'FINISHED' || status == 'ERROR') {
            finishedAt = new Date();
        }

        return queueProcessRepository.updateLastByQueueNRelation(relationId, queue, status, finishedAt);
    }

    public async deleteById(id: number) {
        return queueProcessRepository.deleteById(id);
    }
}

const queueProcessService = new QueueProcessService();
export default queueProcessService;
