import axios,{AxiosError, AxiosResponse} from 'axios';
import { toast } from 'react-toastify';
import { history } from '../..'
import {IActivity} from '../models/activity';
import {IUser,IUserFormValues} from '../models/user';
import {IUserContact} from '../models/userContact';

axios.defaults.baseURL='http://localhost:4500/api';

const responseBody=(Response:AxiosResponse)=>Response.data;

const sleep=(ms:number)=>(response:AxiosResponse)=>
    new Promise<AxiosResponse>(resolve=>setTimeout(() => resolve(response), ms));


//confg network 

axios.interceptors.response.use(async response=>{
    await sleep(5);
    return response;
},(error:AxiosError)=>{
    const{data,status,config}=error.response!;
    switch(status){
        case 400:
            if(typeof data==='string'){
                toast.error(data);
            }
            if(config.method==='get' && data.errors.hasOwnProperty('id')){
                history.push('/not-found');
            }
            if(data.errors){
                const modalStateErrors=[];
                for(const key in data.errors){
                    if(data.errors[key]){
                        modalStateErrors.push(data.errors[key]);
                    }
                }
                throw modalStateErrors.flat();
            }
            else{
                toast.error(data)
            }
            toast.error('bad request');
            break;
        case 401:
            toast.error('unauthorised');
            break;
        case 404:
            history.push('/not-found');
            break;
        case 500:
           // store.commonStore.setServerError(data);
            history.push('/server-error');
            break;
    }
    return Promise.reject(error)
})

const requests={
    get:<T>(url:string)=>axios.get<T>(url).then(responseBody),
    post:<T>(url:string,body:{})=>axios.post<T>(url,body).then(responseBody),
    put:<T>(url:string,body:{})=>axios.put<T>(url,body).then(responseBody),
    delete:(url:string)=>axios.delete(url).then(responseBody)
};

const Activities = {
    list: (): Promise<IActivity[]> => requests.get('/activities'),
    details: (id: string) => requests.get(`/activities/${id}`),
    create: (activity: IActivity) => requests.post('/activities', activity),
    update: (activity: IActivity) => requests.put(`/activities/${activity.id}`, activity),
    delete: (id: string) => requests.delete(`/activities/${id}`)
}

const User = {
    current: (): Promise<IUser> => requests.get('/user'),
    login: (user: IUserFormValues): Promise<IUser> => requests.post(`/user/login`, user),
    register: (user: IUserFormValues): Promise<IUser> => requests.post(`/user/register`, user),
}
const UserContacts ={
    list:()=>requests.get('/UserContacts'),
    details:(id:string)=>requests.get<IUserContact>(`/UserContacts/${id}`),
    create:(userContact:IUserContact)=>requests.post('/UserContacts',userContact),
    delete:(id:string)=>requests.delete(`/UserContacts/${id}`),
    update:(contact:IUserContact)=>requests.put(`/UserContacts/${contact.id}`,contact),
    search:(text:string)=>requests.get<IUserContact>(`/UserContacts/search/${text}`)
}


const agent={
    Activities,UserContacts,User
}
export default agent;


