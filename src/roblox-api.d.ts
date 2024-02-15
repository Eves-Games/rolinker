export interface UserGroup {
    group: Group;
    role: Role
}

export interface Group {
    id: number;
    name: string;
    memberCount: number;
    hasVerifiedBadge: boolean;
}

export interface Role {
    id: number;
    name: string;
    rank: number;
}

export interface User {
    hasVerifiedBadge: boolean;
    id: number;
    name: string;
    displayName: string;
}

export interface Thumbnail {
    requestId: string | null;
    errorCode: number;
    errorMessage: string;
    targetId: number;
    state: string;
    imageUrl: string;
    version: string;
}