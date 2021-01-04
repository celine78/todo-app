export interface Todo {
    id: number;
    title: string;
    dueDate: string;
    category: Category;
    note: string;
    important: boolean;
    completed: boolean;
    userId: number;
}

export enum Category {
    WORK = 'WORK',
    STUDY = 'STUDY',
    HOME = 'HOME',
    HOBBY = 'HOBBY',
    OTHER = 'OTHER'
}