import {faker} from "@faker-js/faker";

export interface Genre {
    id: number;
    code: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
    updatedBy: string;
    status: "ACTIVE" | "INACTIVE";
    deleted: boolean;
}

const createGenre = (id: number): Genre => {
    return {
        id: id,
        code: faker.string.uuid(),
        name: faker.person.fullName(),
        createdAt: faker.date.past(),
        updatedAt: faker.date.recent(),
        createdBy: faker.internet.userName(),
        updatedBy: faker.internet.userName(),
        status: faker.helpers.arrayElement(['ACTIVE', 'INACTIVE']),
        deleted: faker.datatype.boolean()
    };
};

const generateSampleGenres = (length: number): Genre[] => {
    return Array.from({length}, (_, index) => createGenre(index + 1));
}

export default generateSampleGenres;