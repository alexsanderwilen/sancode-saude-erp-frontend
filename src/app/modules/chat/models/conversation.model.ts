export interface ConversationDto {
    type: string; // "private" ou "group"
    id: string;   // username ou groupId
    name: string; // Nome a ser exibido (username ou nome do grupo)
}

