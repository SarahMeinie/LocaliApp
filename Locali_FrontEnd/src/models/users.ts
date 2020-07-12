import { Url } from 'url';

class group{
    name: string;
    admin: boolean;
}

class friend {
    id: string;
}

export class user {
    id: string;
    username: string;
    password: string;
    email: string;
    image: string;  
    first_name: string;
    last_name: string;
    is_active: boolean;
    is_staff: boolean;
}
