import {faker} from "@faker-js/faker";

export interface Movie {
    id: number;
    code: string;
    title: string;
    duration: number;
    age: number;
    rating: number;
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
    updatedBy: string;
    status: "ACTIVE" | "INACTIVE";
    deleted: boolean;
}

const createMovie = (id: number): Movie => {
    return {
        id: id,
        code: faker.string.uuid(),
        title: faker.person.fullName(),
        duration: faker.number.int({min: 1, max: 300}),
        age: faker.number.int({min: 3, max: 18}),
        rating: faker.number.int({min: 0, max: 5}),
        createdAt: faker.date.past(),
        updatedAt: faker.date.recent(),
        createdBy: faker.internet.userName(),
        updatedBy: faker.internet.userName(),
        status: faker.helpers.arrayElement(['ACTIVE', 'INACTIVE']),
        deleted: faker.datatype.boolean()
    };
};

const generateSampleMovies = (length: number): Movie[] => {
    return Array.from({length}, (_, index) => createMovie(index + 1));
}

export default generateSampleMovies;