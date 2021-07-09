import {createContext} from 'react' ;
import { configure } from 'mobx';
import CommonStore from './commonStore';
import ModalStore from './modalStore';
import ActivityStore from './activityStore';
import UserStore from './userStore';

configure({enforceActions:'always'});

export class RootStore{
    commonStore: CommonStore;
    modalStore: ModalStore;
    activityStore: ActivityStore;
    userStore: UserStore;

    constructor(){
        this.commonStore = new CommonStore(this);
        this.modalStore = new ModalStore(this);
        this.activityStore = new ActivityStore(this);
        this.userStore = new UserStore(this);
    }
}

export const RootStoreContext=createContext(new RootStore());