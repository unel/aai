export interface LLMAPI {
    getModels: () => Promise<Array<Record<string, unknown>>>;
    generateCompletion: (options: Record<string, unknown>) => AsyncGenerator<{text: string, done: boolean}>;
}