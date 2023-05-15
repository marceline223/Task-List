export interface Item {
    itemTitle: string;
    itemStatus: boolean;
}

export interface Task {
    taskTitle: string;
    itemList: Item[];
}
