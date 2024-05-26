export interface LLMAPI {
    getModels: () => Promise<any[]>;
     generateCompletion: (options: Record<string, any>) => any;
}