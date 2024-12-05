import { SelectProps } from '@/components/Admin/Select';
import { useAllDistricts, useAllProvinces, useAllWards } from '@/modules/provinces/repository';
import { useFormikContext } from 'formik';
import React from 'react';

interface UseAddressReturn {
    cityOptions: SelectProps['options'];
    districtOptions: SelectProps['options'];
    wardOptions: SelectProps['options'];
}

interface FormValues {
    city: string;
    cityCode: string;
    district: string;
    districtCode: string;
    ward: string;
    wardCode: string;
}

export const useAddress = (): UseAddressReturn => {
    const { values, setFieldValue } = useFormikContext<FormValues>();

    const { data: cities } = useAllProvinces();
    const { data: districts } = useAllDistricts(values.cityCode);
    const { data: wards } = useAllWards(values.districtCode);

    React.useEffect(() => {
        setFieldValue('city', cities?.find(city => city.province_id === values.cityCode)?.province_name || '');
        setFieldValue('district', '');
        setFieldValue('districtCode', '');
        setFieldValue('ward', '');
        setFieldValue('wardCode', '');
    }, [values.cityCode, cities]);

    React.useEffect(() => {
        setFieldValue('district', districts?.find(district => district.district_id === values.districtCode)?.district_name || '');
        setFieldValue('ward', '');
        setFieldValue('wardCode', '');
    }, [values.districtCode, districts]);

    React.useEffect(() => {
        setFieldValue('ward', wards?.find(ward => ward.ward_id === values.wardCode)?.ward_name || '');
    }, [values.wardCode, wards]);


    const cityOptions: SelectProps['options'] = (cities || []).map(city => ({
        value: city.province_id,
        label: city.province_name,
    }));

    const districtOptions: SelectProps['options'] = (districts || []).map(district => ({
        value: district.district_id,
        label: district.district_name,
    }));

    const wardOptions: SelectProps['options'] = (wards || []).map(ward => ({
        value: ward.ward_id,
        label: ward.ward_name,
    }));

    return {
        cityOptions,
        districtOptions,
        wardOptions,
    };
};