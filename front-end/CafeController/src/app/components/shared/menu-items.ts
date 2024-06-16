import { Injectable } from "@angular/core";

export interface Menu {
    state: string;
    name: string;
    type: string;
    icon: string;
    role: string;
}

const MENUITEMS = [
    { state: 'dashbord', name: 'Dashbord', type: 'link', icon: 'dashboard', role: '' },
    { state: 'category', name: 'Category', type: 'link', icon: 'category', role: 'admin' },
    { state: 'product', name: 'Product', type: 'link', icon: 'inventory_2', role: 'admin' },
    { state: 'order', name: 'Order', type: 'link', icon: 'shopping_cart', role: '' },
    { state: 'bill', name: 'Bill', type: 'link', icon: 'backup_table', role: '' }
];

@Injectable({ providedIn: 'root' }) // Register as root provider
export class MenuItems {
    getMenuItem(): Menu[] {
        return MENUITEMS;
    }
}