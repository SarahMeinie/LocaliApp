export class post {
    id: number;
    Latitude: number;
    Longitude: number;
    body: string;
    user: string;
    posted_at: Date;
    private: boolean;
    Categories: string[];
}

export class like {
    user: string;
    post: number;
}

export class comment {
    body: string;
}

export class currentPost extends post {
    likes: number;
    comments: number;
}