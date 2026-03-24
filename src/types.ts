export interface BaseMessage {
    id: string;
    timestamp: number;
}

export interface TextMessage extends BaseMessage {
    type: 'text';
    sender: string;
    content: string;
}

export interface SystemMessage extends BaseMessage {
    type: 'system';
    action: 'joined' | 'left' | 'typing';
    user: string;
}

export interface ErrorMessage extends BaseMessage {
    type: 'error';
    code: number;
    reason: string;
}

export interface CommandMessage extends BaseMessage {
    type: 'command';
    command: string;
    sender: string;
}

export interface NotificationMessage extends BaseMessage {
    type: 'notification';
    title?: string;
    content: string | string[];
}

export type ChatMessage = TextMessage | SystemMessage | ErrorMessage | CommandMessage | NotificationMessage;

export interface ServerEvents {
    'message:receive': ChatMessage;
    'status:change': { status: 'online' | 'offline' | 'connecting' };
    'user:typing': { user: string; isTyping: boolean };
    'command:action': { action: 'help' | 'clear' };
}
