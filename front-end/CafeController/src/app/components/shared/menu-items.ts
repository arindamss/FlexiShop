import { Injectable } from "@angular/core";

export interface Menu {
    state: string;
    name: string;
    type: string;
    icon: string;
    role: string;
}

const MENUITEMS = [
    { state: 'dashbord', name: 'Dashbord', type: 'link', icon: 'dashboard', role: '' }
];

@Injectable({ providedIn: 'root' }) // Register as root provider
export class MenuItems {
    getMenuItem(): Menu[] {
        return MENUITEMS;
    }
}