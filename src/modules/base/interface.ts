export interface BaseEntity {
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
    updatedBy: string;
}

export enum BaseStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
}

export const BaseStatusVietnamese: Record<BaseStatus, string> = {
    [BaseStatus.ACTIVE]: 'Đang hoạt động',
    [BaseStatus.INACTIVE]: 'Ngưng hoạt động',
};

export interface Pageable {
    page?: number;
}