export interface Item {
    itemTitle: string;
    itemStatus: boolean;
}

export interface Task {
    title: string;
    itemList: Item[];
}
