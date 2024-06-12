import APIConnection from '../ApiConnection';

export type IIntent = 'show_trending_topics' | 'popular_videos' | 'graph_views_minutes';
export default class IaAPIConnection extends APIConnection {
    constructor(baseUrl: string) {
        super(baseUrl);
    }

    async getIntent(text: string): Promise<IIntent> {
        return this.request({
            url: '/intent',
            method: 'POST',
            data: {
                text,
            },
        });
    }
}
