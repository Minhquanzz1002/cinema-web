import axios from 'axios';
import {
    District,
    DistrictResponse,
    Province,
    ProvinceResponse,
    Ward,
    WardResponse,
} from '@/modules/provinces/interface';
import { useQuery } from '@tanstack/react-query';

/**
 * get provinces
 */

const getAllProvince = async (): Promise<Province[]> => {
    try {
        const response = await axios.get<ProvinceResponse>('https://vapi.vnappmob.com/api/province/');
        return response.data.results;
    } catch (error) {
        console.error('Failed to fetch provinces:', error);
        return [];
    }
};

export const useAllProvinces = () => {
    return useQuery({
        queryFn: getAllProvince,
        queryKey: ['provinces'],
    });
};


/**
 * get districts
 */

const getAllDistricts = async (provinceId?: string): Promise<District[]> => {
    try {
        const response = await axios.get<DistrictResponse>(`https://vapi.vnappmob.com/api/province/district/${provinceId}`);
        return response.data.results;
    } catch (error) {
        console.error('Failed to fetch provinces:', error);
        return [];
    }
};

export const useAllDistricts = (provinceId?: string) => {
    return useQuery({
        queryFn: () => getAllDistricts(provinceId),
        queryKey: ['districts', provinceId],
        enabled: !!provinceId,
    });
};

/**
 * get wards
 */

const getAllWards = async (districtId?: string): Promise<Ward[]> => {
    try {
        const response = await axios.get<WardResponse>(`https://vapi.vnappmob.com/api/province/ward/${districtId}`);
        return response.data.results;
    } catch (error) {
        console.error('Failed to fetch provinces:', error);
        return [];
    }
};

export const useAllWards = (districtId?: string) => {
    return useQuery({
        queryKey: ['wards', districtId],
        queryFn: () => getAllWards(districtId),
        enabled: !!districtId,
    });
};