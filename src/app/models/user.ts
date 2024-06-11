import { Timestamp } from '@firebase/firestore-types';

export interface User{
    password:string;
    fname:string;
    lname:string;
    faceid:Float32Array[];
    email:string;
    phone:string;
    loginTime:Date[]
}