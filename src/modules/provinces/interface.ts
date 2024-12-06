export interface Province {
    province_id: string;
    province_name: string;
}

export interface ProvinceResponse {
    results: Province[];
}


export interface District {
    district_id: string;
    district_name: string;
}

export interface DistrictResponse {
    results: District[];
}


export interface Ward {
    ward_id: string;
    ward_name: string;
}

export interface WardResponse {
    results: Ward[];
}