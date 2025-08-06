import { connect, StringCodec } from 'nats';

class BrokerBus {
    constructor() {
        this.sc = StringCodec();
        this.ncPromise = null;
        this.subscriptions = new Map();
    }

    async connect() {
        if (!this.ncPromise) {
            const servers = process.env.NATS_URL || 'nats://localhost:4222';
            this.ncPromise = connect({ servers });
        }
        return this.ncPromise;
    }

    async publish(subject, payload) {
        try {
            const nc = await this.connect();
            const data = this.sc.encode(JSON.stringify(payload));
            nc.publish(subject, data);
        } catch (err) {
            console.error('BrokerBus publish error', err);
        }
    }

    async subscribe(subject, handler) {
        const nc = await this.connect();
        const sub = nc.subscribe(subject);
        (async () => {
            for await (const msg of sub) {
                try {
                    const decoded = JSON.parse(this.sc.decode(msg.data));
                    await handler(decoded);
                } catch (err) {
                    console.error('BrokerBus subscribe handler error', err);
                }
            }
        })();
        this.subscriptions.set(subject, sub);
        return sub;
    }

    async unsubscribe(subject) {
        const sub = this.subscriptions.get(subject);
        if (sub) {
            sub.unsubscribe();
            this.subscriptions.delete(subject);
        }
    }

    async close() {
        if (this.ncPromise) {
            const nc = await this.ncPromise;
            await nc.close();
            this.ncPromise = null;
            this.subscriptions.clear();
        }
    }
}

const brokerBus = new BrokerBus();
export default brokerBus;
