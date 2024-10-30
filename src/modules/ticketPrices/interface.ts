import { BaseStatus } from '@/modules/base/interface';
import { SeatType } from '@/modules/seats/interface';

export enum AudienceType {
    ADULT = 'ADULT',
    CHILD = 'CHILD',
    STUDENT = 'STUDENT',
}

export enum ApplyForDay {
    MONDAY = 'MONDAY',
    TUESDAY = 'TUESDAY',
    WEDNESDAY = 'WEDNESDAY',
    THURSDAY = 'THURSDAY',
    FRIDAY = 'FRIDAY',
    SATURDAY = 'SATURDAY',
    SUNDAY = 'SUNDAY',
}

export const ApplyForDayVietnamese = {
    MONDAY: 'Thứ 2',
    TUESDAY: 'Thứ 3',
    WEDNESDAY: 'Thứ 4',
    THURSDAY: 'Thứ 5',
    FRIDAY: 'Thứ 6',
    SATURDAY: 'Thứ 7',
    SUNDAY: 'Chủ nhật',
};

export interface AdminTicketPriceDetailOverview {
    id: number;
    seatType: SeatType;
    price: number;
    status: BaseStatus;
}

export interface AdminTicketPriceLineOverview {
    id: number;
    applyForDays: ApplyForDay[];
    startTime: string;
    endTime: string;
    audienceType: AudienceType;
    status: BaseStatus;
    ticketPriceDetails: AdminTicketPriceDetailOverview[];
}

export enum TicketPriceStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
}

export const ProductPriceStatusVietnamese = {
    ACTIVE: 'Đang áp dụng',
    INACTIVE: 'Ngừng áp dụng',
};

export interface AdminTicketPriceOverview {
    id: number;
    name: string;
    startDate: Date;
    endDate: Date;
    status: TicketPriceStatus;
    ticketPriceLines: AdminTicketPriceLineOverview[];
}