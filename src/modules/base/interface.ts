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
    [BaseStatus.ACTIVE]: 'Đang áp dụng',
    [BaseStatus.INACTIVE]: 'Ngưng áp dụng',
};

export interface Pageable {
    page?: number;
}

export enum VisibilityStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
}

export const VisibilityStatusVietnamese: Record<VisibilityStatus, string> = {
    [VisibilityStatus.ACTIVE]: 'Hiển thị',
    [VisibilityStatus.INACTIVE]: 'Ẩn',
};