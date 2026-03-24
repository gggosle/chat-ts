import { EventEmitter } from './EventEmitter';
import { ServerEvents } from './types';

export class FakeServer extends EventEmitter<ServerEvents> {
    private botNames = ['HelpBot', 'EchoBot', 'ChaosBot'];
    private botMessages = [
        "Just checking in!",
        "Does anyone want to play checkers?",
        "I think the server is lagging...",
        "Hello, world!"
    ];
    private serverErrors = ['Internal Server Error', 'Service Unavailable', 'Bad Gateway'];
    private spamInterval: ReturnType<typeof setInterval> | null = null;

    connect(): void {
        this.emit('status:change', { status: 'connecting' });

        setTimeout(() => {
            this.emit('status:change', { status: 'online' });

            setTimeout(() => {
                this.emit('message:receive', {
                    id: crypto.randomUUID(),
                    timestamp: Date.now(),
                    type: 'system',
                    action: 'joined',
                    user: 'EchoBot'
                });
                this.startSpontaneousBots();
            }, 1000);
        }, 1500);
    }

    disconnect(): void {
        if (this.spamInterval) {
            clearInterval(this.spamInterval);
            this.spamInterval = null;
        }
        this.emit('status:change', { status: 'offline' });
    }

    private startSpontaneousBots(): void {
        const loop = () => {
            const delay = 10000 + Math.random() * 5000;

            this.spamInterval = setTimeout(() => {
                this.triggerSpontaneousMessage();
                loop();
            }, delay);
        };

        loop();
    }

    private triggerSpontaneousMessage(): void {
        const bot = this.#getRandomBotName();
        const randomMsg = this.botMessages[Math.floor(Math.random() * this.botMessages.length)];

        this.emit('user:typing', { user: bot, isTyping: true });

        setTimeout(() => {
            this.emit('user:typing', { user: bot, isTyping: false });
            this.emit('message:receive', {
                id: crypto.randomUUID(),
                timestamp: Date.now(),
                type: 'text',
                sender: bot,
                content: randomMsg
            });
        }, 1500);
    }

    sendMessage(text: string): void {
        this.emit('message:receive', {
            id: crypto.randomUUID(),
            timestamp: Date.now(),
            type: 'text',
            sender: 'Me',
            content: text
        });

        setTimeout(() => {
            const randomOutcome = Math.random();

            if (randomOutcome > 0.8) {
                this.#simulateRandomServerError();
                return;
            }

            const bot = this.#getRandomBotName();
            this.emit('user:typing', { user: bot, isTyping: true });

            setTimeout(() => {
                this.#simulateServerReply(text, bot);
            }, 800 + Math.random() * 1000);

        }, 500);
    }

    #getRandomBotName(): string {
        return this.botNames[Math.floor(Math.random() * this.botNames.length)];
    }

    #simulateRandomServerError() : void {
        this.emit('message:receive', {
            id: crypto.randomUUID(),
            timestamp: Date.now(),
            type: 'error',
            code: 500,
            reason: this.#getRandomServerError(),
        });
    }

    #getRandomServerError(): string {
        return this.serverErrors[Math.floor(Math.random() * this.serverErrors.length)];
    }

    #simulateServerReply(text : string, bot: string) : void {
        this.emit('user:typing', { user: bot, isTyping: false });
        this.emit('message:receive', {
            id: crypto.randomUUID(),
            timestamp: Date.now(),
            type: 'text',
            sender: bot,
            content: `I received: "${text}". Fascinating.`
        });
    }
}