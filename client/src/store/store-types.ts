export interface Item {
    id: number;
    itemTitle: string;
    itemStatus: boolean;
}

export interface Task {
    id: number;
    taskTitle: string;
    itemList: Item[];
}
