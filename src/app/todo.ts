export interface Todo {
    id: number;
    title: string;
    dueDate: Date;
    category: Category;
    note: string;
    important: boolean;
    completed: boolean;
}

enum Category {
    WORK = 'WORK',
    STUDY = 'STUDY',
    HOME = 'HOME',
    HOBBY = 'HOBBY',
    OTHER = 'OTHER'
}