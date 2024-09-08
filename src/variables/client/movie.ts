const movies = [
    {
        id: 1,
        image: "https://cdn.galaxycine.vn/media/2024/7/18/alien-romulus-500_1721273080878.jpg",
        title: "Quái Vật Không Gian: Romulus",
        soT: "T18",
        time: "118 phút",
        date: "16/08/2024",
        numberStar: "8.7 (187 votes)",
        nation: "Mỹ",
        manufacturer: "20th Century Studios",
        genre: ["Hành Động", "Giả Tưởng", "Phiêu Lưu"],
        director: "Fede Alvarez",
        performer: ["Cailee Spaeny", "Isabela Merced", "Spike Fearn"],
        status: "Đang chiếu",
        content: "Phần phim mới nhất của thương hiệu phim quái vật gây ám ảnh nhất lịch sử điện ảnh theo chân một nhóm người khai hoang lục địa, đang tìm kiếm những gì còn sót lại trên một trạm vũ trụ bỏ hoang. Thế nhưng mọi chuyện trở thành một thảm kịch khi họ phải đối mặt với những thực thể quái vật ghê tởm nhất, và chuyến đi đầy hi vọng lại trở thành cơn ác mộng đối với tất cả mọi người.",
        showtimes: "16/08/2024 - 16/09/2024",
        theater: [
            {
                name: "Galaxy Sala",
                showtimes: ["09:00", "12:00", "15:00"]
            },
            {
                name: "Galaxy Đà Nẵng",
                showtimes: ["10:00", "13:00", "16:00"]
            },
            {
                name: "Galaxy Trung Chánh",
                showtimes: ["11:00", "14:00", "17:00"]
            },
            {
                name: "Galaxy Hải Phòng",
                showtimes: ["09:30", "12:30", "15:30"]
            },
            {
                name: "Galaxy Nguyễn Văn Quá",
                showtimes: ["10:30", "13:30", "16:30"]
            },
            {
                name: "Galaxy Co.opXtra Linh Trung",
                showtimes: ["11:30", "14:30", "17:30"]
            },
            {
                name: "Galaxy Trường Chinh",
                showtimes: ["12:00", "15:00", "18:00"]
            }
        ]
    },
    {
        id: 2,
        image: "https://cdn.galaxycine.vn/media/2024/8/13/blue-lock-the-movie--episode-nagi--2_1723516208393.jpg",
        title: "Quái Vật Không Gian: Romulus",
        soT: "T18",
        time: "118 phút",
        date: "16/08/2024",
        numberStar: "8.7 (187 votes)",
        nation: "Mỹ",
        manufacturer: "20th Century Studios",
        genre: ["Hành Động", "Giả Tưởng", "Phiêu Lưu"],
        director: "Fede Alvarez",
        performer: ["Cailee Spaeny", "Isabela Merced", "Spike Fearn"],
        status: "Đang chiếu",
        content: "Phần phim mới nhất của thương hiệu phim quái vật gây ám ảnh nhất lịch sử điện ảnh theo chân một nhóm người khai hoang lục địa, đang tìm kiếm những gì còn sót lại trên một trạm vũ trụ bỏ hoang. Thế nhưng mọi chuyện trở thành một thảm kịch khi họ phải đối mặt với những thực thể quái vật ghê tởm nhất, và chuyến đi đầy hi vọng lại trở thành cơn ác mộng đối với tất cả mọi người.",
        showtimes: "16/08/2024 - 16/09/2024",
        theater: [
            {
                name: "Galaxy Sala",
                showtimes: ["09:00", "12:00", "15:00"]
            },
            {
                name: "Galaxy Đà Nẵng",
                showtimes: ["10:00", "13:00", "16:00"]
            },
            {
                name: "Galaxy Trung Chánh",
                showtimes: ["11:00", "14:00", "17:00"]
            },
            {
                name: "Galaxy Hải Phòng",
                showtimes: ["09:30", "12:30", "15:30"]
            },
            {
                name: "Galaxy Nguyễn Văn Quá",
                showtimes: ["10:30", "13:30", "16:30"]
            },
            {
                name: "Galaxy Co.opXtra Linh Trung",
                showtimes: ["11:30", "14:30", "17:30"]
            },
            {
                name: "Galaxy Trường Chinh",
                showtimes: ["12:00", "15:00", "18:00"]
            }
        ]
    },
    {
        id: 3,
        image: "https://cdn.galaxycine.vn/media/2024/8/16/ma-da-500_1723799717930.jpg",
        title: "Ma Da",
        soT: "T16",
        time: "94 phút",
        date: "16/08/2024",
        numberStar: "8.7 (187 votes)",
        nation: "Việt Nam",
        manufacturer: "Đang cập nhật",
        genre: ["Kinh Dị", "Hài Hước", "Tâm Lý"],
        director: "Nguyễn Hữu Hoàng",
        performer: ["Cailee Spaeny", "Isabela Merced", "Spike Fearn"],
        status: "Đang chiếu",
        content: "Phần phim mới nhất của thương hiệu phim quái vật gây ám ảnh nhất lịch sử điện ảnh theo chân một nhóm người khai hoang lục địa, đang tìm kiếm những gì còn sót lại trên một trạm vũ trụ bỏ hoang. Thế nhưng mọi chuyện trở thành một thảm kịch khi họ phải đối mặt với những thực thể quái vật ghê tởm nhất, và chuyến đi đầy hi vọng lại trở thành cơn ác mộng đối với tất cả mọi người.",
        showtimes: "16/08/2024 - 16/09/2024",
        theater: [
            {
                name: "Galaxy Sala",
                showtimes: ["09:00", "12:00", "15:00"]
            },
            {
                name: "Galaxy Đà Nẵng",
                showtimes: ["10:00", "13:00", "16:00"]
            },
            {
                name: "Galaxy Trung Chánh",
                showtimes: ["11:00", "14:00", "17:00"]
            },
            {
                name: "Galaxy Hải Phòng",
                showtimes: ["09:30", "12:30", "15:30"]
            },
            {
                name: "Galaxy Nguyễn Văn Quá",
                showtimes: ["10:30", "13:30", "16:30"]
            },
            {
                name: "Galaxy Co.opXtra Linh Trung",
                showtimes: ["11:30", "14:30", "17:30"]
            },
            {
                name: "Galaxy Trường Chinh",
                showtimes: ["12:00", "15:00", "18:00"]
            }
        ]
    },
    {
        id: 4,
        image: "https://cdn.galaxycine.vn/media/2024/8/1/handsome-guys-500_1722487016960.jpg",
        title: "Quái Vật Không Gian: Romulus",
        soT: "T18",
        time: "118 phút",
        date: "16/08/2024",
        numberStar: "8.7 (187 votes)",
        nation: "Mỹ",
        manufacturer: "20th Century Studios",
        genre: ["Hành Động", "Giả Tưởng", "Phiêu Lưu"],
        director: "Fede Alvarez",
        performer: ["Cailee Spaeny", "Isabela Merced", "Spike Fearn"],
        status: "Đang chiếu",
        content: "Phần phim mới nhất của thương hiệu phim quái vật gây ám ảnh nhất lịch sử điện ảnh theo chân một nhóm người khai hoang lục địa, đang tìm kiếm những gì còn sót lại trên một trạm vũ trụ bỏ hoang. Thế nhưng mọi chuyện trở thành một thảm kịch khi họ phải đối mặt với những thực thể quái vật ghê tởm nhất, và chuyến đi đầy hi vọng lại trở thành cơn ác mộng đối với tất cả mọi người.",
        showtimes: "16/08/2024 - 16/09/2024",
        theater: [
            {
                name: "Galaxy Sala",
                showtimes: ["09:00", "12:00", "15:00"]
            },
            {
                name: "Galaxy Đà Nẵng",
                showtimes: ["10:00", "13:00", "16:00"]
            },
            {
                name: "Galaxy Trung Chánh",
                showtimes: ["11:00", "14:00", "17:00"]
            },
            {
                name: "Galaxy Hải Phòng",
                showtimes: ["09:30", "12:30", "15:30"]
            },
            {
                name: "Galaxy Nguyễn Văn Quá",
                showtimes: ["10:30", "13:30", "16:30"]
            },
            {
                name: "Galaxy Co.opXtra Linh Trung",
                showtimes: ["11:30", "14:30", "17:30"]
            },
            {
                name: "Galaxy Trường Chinh",
                showtimes: ["12:00", "15:00", "18:00"]
            }
        ]
    },
    {
        id: 5,
        image: "https://cdn.galaxycine.vn/media/2024/8/2/detective-conan-the-million-dollar-pentagram-2_1722570544258.jpg",
        title: "Quái Vật Không Gian: Romulus",
        soT: "T18",
        time: "118 phút",
        date: "16/08/2024",
        numberStar: "8.7 (187 votes)",
        nation: "Mỹ",
        manufacturer: "20th Century Studios",
        genre: ["Hành Động", "Giả Tưởng", "Phiêu Lưu"],
        director: "Fede Alvarez",
        performer: ["Cailee Spaeny", "Isabela Merced", "Spike Fearn"],
        status: "Đang chiếu",
        content: "Phần phim mới nhất của thương hiệu phim quái vật gây ám ảnh nhất lịch sử điện ảnh theo chân một nhóm người khai hoang lục địa, đang tìm kiếm những gì còn sót lại trên một trạm vũ trụ bỏ hoang. Thế nhưng mọi chuyện trở thành một thảm kịch khi họ phải đối mặt với những thực thể quái vật ghê tởm nhất, và chuyến đi đầy hi vọng lại trở thành cơn ác mộng đối với tất cả mọi người.",
        showtimes: "16/08/2024 - 16/09/2024",
        theater: [
            {
                name: "Galaxy Sala",
                showtimes: ["09:00", "12:00", "15:00"]
            },
            {
                name: "Galaxy Đà Nẵng",
                showtimes: ["10:00", "13:00", "16:00"]
            },
            {
                name: "Galaxy Trung Chánh",
                showtimes: ["11:00", "14:00", "17:00"]
            },
            {
                name: "Galaxy Hải Phòng",
                showtimes: ["09:30", "12:30", "15:30"]
            },
            {
                name: "Galaxy Nguyễn Văn Quá",
                showtimes: ["10:30", "13:30", "16:30"]
            },
            {
                name: "Galaxy Co.opXtra Linh Trung",
                showtimes: ["11:30", "14:30", "17:30"]
            },
            {
                name: "Galaxy Trường Chinh",
                showtimes: ["12:00", "15:00", "18:00"]
            }
        ]
    },
    {
        id: 6,
        image: "https://cdn.galaxycine.vn/media/2024/7/30/crayon-shin-chan-our-dinosaur-diary-1_1722309909161.jpg",
        title: "Quái Vật Không Gian: Romulus",
        soT: "T18",
        time: "118 phút",
        date: "16/08/2024",
        numberStar: "8.7 (187 votes)",
        nation: "Mỹ",
        manufacturer: "20th Century Studios",
        genre: ["Hành Động", "Giả Tưởng", "Phiêu Lưu"],
        director: "Fede Alvarez",
        performer: ["Cailee Spaeny", "Isabela Merced", "Spike Fearn"],
        status: "Đang chiếu",
        content: "Phần phim mới nhất của thương hiệu phim quái vật gây ám ảnh nhất lịch sử điện ảnh theo chân một nhóm người khai hoang lục địa, đang tìm kiếm những gì còn sót lại trên một trạm vũ trụ bỏ hoang. Thế nhưng mọi chuyện trở thành một thảm kịch khi họ phải đối mặt với những thực thể quái vật ghê tởm nhất, và chuyến đi đầy hi vọng lại trở thành cơn ác mộng đối với tất cả mọi người.",
        showtimes: "16/08/2024 - 16/09/2024",
        theater: [
            {
                name: "Galaxy Sala",
                showtimes: ["09:00", "12:00", "15:00"]
            },
            {
                name: "Galaxy Đà Nẵng",
                showtimes: ["10:00", "13:00", "16:00"]
            },
            {
                name: "Galaxy Trung Chánh",
                showtimes: ["11:00", "14:00", "17:00"]
            },
            {
                name: "Galaxy Hải Phòng",
                showtimes: ["09:30", "12:30", "15:30"]
            },
            {
                name: "Galaxy Nguyễn Văn Quá",
                showtimes: ["10:30", "13:30", "16:30"]
            },
            {
                name: "Galaxy Co.opXtra Linh Trung",
                showtimes: ["11:30", "14:30", "17:30"]
            },
            {
                name: "Galaxy Trường Chinh",
                showtimes: ["12:00", "15:00", "18:00"]
            }
        ]
    },
    {
        id: 7,
        image: "https://cdn.galaxycine.vn/media/2024/8/16/yakari_1723774936977.jpg",
        title: "Quái Vật Không Gian: Romulus",
        soT: "T18",
        time: "118 phút",
        date: "16/08/2024",
        numberStar: "8.7 (187 votes)",
        nation: "Mỹ",
        manufacturer: "20th Century Studios",
        genre: ["Hành Động", "Giả Tưởng", "Phiêu Lưu"],
        director: "Fede Alvarez",
        performer: ["Cailee Spaeny", "Isabela Merced", "Spike Fearn"],
        status: "Đang chiếu",
        content: "Phần phim mới nhất của thương hiệu phim quái vật gây ám ảnh nhất lịch sử điện ảnh theo chân một nhóm người khai hoang lục địa, đang tìm kiếm những gì còn sót lại trên một trạm vũ trụ bỏ hoang. Thế nhưng mọi chuyện trở thành một thảm kịch khi họ phải đối mặt với những thực thể quái vật ghê tởm nhất, và chuyến đi đầy hi vọng lại trở thành cơn ác mộng đối với tất cả mọi người.",
        showtimes: "16/08/2024 - 16/09/2024",
        theater: [
            {
                name: "Galaxy Sala",
                showtimes: ["09:00", "12:00", "15:00"]
            },
            {
                name: "Galaxy Đà Nẵng",
                showtimes: ["10:00", "13:00", "16:00"]
            },
            {
                name: "Galaxy Trung Chánh",
                showtimes: ["11:00", "14:00", "17:00"]
            },
            {
                name: "Galaxy Hải Phòng",
                showtimes: ["09:30", "12:30", "15:30"]
            },
            {
                name: "Galaxy Nguyễn Văn Quá",
                showtimes: ["10:30", "13:30", "16:30"]
            },
            {
                name: "Galaxy Co.opXtra Linh Trung",
                showtimes: ["11:30", "14:30", "17:30"]
            },
            {
                name: "Galaxy Trường Chinh",
                showtimes: ["12:00", "15:00", "18:00"]
            }
        ]
    },
    {
        id: 8,
        image: "https://cdn.galaxycine.vn/media/2024/8/2/secret-a-hidden-score-3_1722588421262.jpg",
        title: "Quái Vật Không Gian: Romulus",
        soT: "T18",
        time: "118 phút",
        date: "16/08/2024",
        numberStar: "8.7 (187 votes)",
        nation: "Mỹ",
        manufacturer: "20th Century Studios",
        genre: ["Hành Động", "Giả Tưởng", "Phiêu Lưu"],
        director: "Fede Alvarez",
        performer: ["Cailee Spaeny", "Isabela Merced", "Spike Fearn"],
        status: "Đang chiếu",
        content: "Phần phim mới nhất của thương hiệu phim quái vật gây ám ảnh nhất lịch sử điện ảnh theo chân một nhóm người khai hoang lục địa, đang tìm kiếm những gì còn sót lại trên một trạm vũ trụ bỏ hoang. Thế nhưng mọi chuyện trở thành một thảm kịch khi họ phải đối mặt với những thực thể quái vật ghê tởm nhất, và chuyến đi đầy hi vọng lại trở thành cơn ác mộng đối với tất cả mọi người.",
        showtimes: "16/08/2024 - 16/09/2024",
        theater: [
            {
                name: "Galaxy Sala",
                showtimes: ["09:00", "12:00", "15:00"]
            },
            {
                name: "Galaxy Đà Nẵng",
                showtimes: ["10:00", "13:00", "16:00"]
            },
            {
                name: "Galaxy Trung Chánh",
                showtimes: ["11:00", "14:00", "17:00"]
            },
            {
                name: "Galaxy Hải Phòng",
                showtimes: ["09:30", "12:30", "15:30"]
            },
            {
                name: "Galaxy Nguyễn Văn Quá",
                showtimes: ["10:30", "13:30", "16:30"]
            },
            {
                name: "Galaxy Co.opXtra Linh Trung",
                showtimes: ["11:30", "14:30", "17:30"]
            },
            {
                name: "Galaxy Trường Chinh",
                showtimes: ["12:00", "15:00", "18:00"]
            }
        ]
    },
    {
        id: 9,
        image: "https://cdn.galaxycine.vn/media/2024/8/13/co-dau-hao-mon-1_1723520489120.jpg",
        title: "Quái Vật Không Gian: Romulus",
        soT: "T18",
        time: "118 phút",
        date: "16/08/2024",
        numberStar: "8.7 (187 votes)",
        nation: "Mỹ",
        manufacturer: "20th Century Studios",
        genre: ["Hành Động", "Giả Tưởng", "Phiêu Lưu"],
        director: "Fede Alvarez",
        performer: ["Cailee Spaeny", "Isabela Merced", "Spike Fearn"],
        status: "Sắp chiếu",
        content: "Phần phim mới nhất của thương hiệu phim quái vật gây ám ảnh nhất lịch sử điện ảnh theo chân một nhóm người khai hoang lục địa, đang tìm kiếm những gì còn sót lại trên một trạm vũ trụ bỏ hoang. Thế nhưng mọi chuyện trở thành một thảm kịch khi họ phải đối mặt với những thực thể quái vật ghê tởm nhất, và chuyến đi đầy hi vọng lại trở thành cơn ác mộng đối với tất cả mọi người.",
        showtimes: "16/08/2024 - 16/09/2024",
        theater: [
            {
                name: "Galaxy Sala",
                showtimes: ["09:00", "12:00", "15:00"]
            },
            {
                name: "Galaxy Đà Nẵng",
                showtimes: ["10:00", "13:00", "16:00"]
            },
            {
                name: "Galaxy Trung Chánh",
                showtimes: ["11:00", "14:00", "17:00"]
            },
            {
                name: "Galaxy Hải Phòng",
                showtimes: ["09:30", "12:30", "15:30"]
            },
            {
                name: "Galaxy Nguyễn Văn Quá",
                showtimes: ["10:30", "13:30", "16:30"]
            },
            {
                name: "Galaxy Co.opXtra Linh Trung",
                showtimes: ["11:30", "14:30", "17:30"]
            },
            {
                name: "Galaxy Trường Chinh",
                showtimes: ["12:00", "15:00", "18:00"]
            }
        ]
    },
    {
        id: 10,
        image: "https://cdn.galaxycine.vn/media/2024/8/13/am-duong-su-0-500_1723535564512.jpg",
        title: "Quái Vật Không Gian: Romulus",
        soT: "T18",
        time: "118 phút",
        date: "16/08/2024",
        numberStar: "8.7 (187 votes)",
        nation: "Mỹ",
        manufacturer: "20th Century Studios",
        genre: ["Hành Động", "Giả Tưởng", "Phiêu Lưu"],
        director: "Fede Alvarez",
        performer: ["Cailee Spaeny", "Isabela Merced", "Spike Fearn"],
        status: "Sắp chiếu",
        content: "Phần phim mới nhất của thương hiệu phim quái vật gây ám ảnh nhất lịch sử điện ảnh theo chân một nhóm người khai hoang lục địa, đang tìm kiếm những gì còn sót lại trên một trạm vũ trụ bỏ hoang. Thế nhưng mọi chuyện trở thành một thảm kịch khi họ phải đối mặt với những thực thể quái vật ghê tởm nhất, và chuyến đi đầy hi vọng lại trở thành cơn ác mộng đối với tất cả mọi người.",
        showtimes: "16/08/2024 - 16/09/2024",
        theater: [
            {
                name: "Galaxy Sala",
                showtimes: ["09:00", "12:00", "15:00"]
            },
            {
                name: "Galaxy Đà Nẵng",
                showtimes: ["10:00", "13:00", "16:00"]
            },
            {
                name: "Galaxy Trung Chánh",
                showtimes: ["11:00", "14:00", "17:00"]
            },
            {
                name: "Galaxy Hải Phòng",
                showtimes: ["09:30", "12:30", "15:30"]
            },
            {
                name: "Galaxy Nguyễn Văn Quá",
                showtimes: ["10:30", "13:30", "16:30"]
            },
            {
                name: "Galaxy Co.opXtra Linh Trung",
                showtimes: ["11:30", "14:30", "17:30"]
            },
            {
                name: "Galaxy Trường Chinh",
                showtimes: ["12:00", "15:00", "18:00"]
            }
        ]
    },
    {
        id: 11,
        image: "https://cdn.galaxycine.vn/media/2024/8/15/gieng-qu-500_1723693934297.jpg",
        title: "Quái Vật Không Gian: Romulus",
        soT: "T18",
        time: "118 phút",
        date: "16/08/2024",
        numberStar: "8.7 (187 votes)",
        nation: "Mỹ",
        manufacturer: "20th Century Studios",
        genre: ["Hành Động", "Giả Tưởng", "Phiêu Lưu"],
        director: "Fede Alvarez",
        performer: ["Cailee Spaeny", "Isabela Merced", "Spike Fearn"],
        status: "Sắp chiếu",
        content: "Phần phim mới nhất của thương hiệu phim quái vật gây ám ảnh nhất lịch sử điện ảnh theo chân một nhóm người khai hoang lục địa, đang tìm kiếm những gì còn sót lại trên một trạm vũ trụ bỏ hoang. Thế nhưng mọi chuyện trở thành một thảm kịch khi họ phải đối mặt với những thực thể quái vật ghê tởm nhất, và chuyến đi đầy hi vọng lại trở thành cơn ác mộng đối với tất cả mọi người.",
        showtimes: "16/08/2024 - 16/09/2024",
        theater: [
            {
                name: "Galaxy Sala",
                showtimes: ["09:00", "12:00", "15:00"]
            },
            {
                name: "Galaxy Đà Nẵng",
                showtimes: ["10:00", "13:00", "16:00"]
            },
            {
                name: "Galaxy Trung Chánh",
                showtimes: ["11:00", "14:00", "17:00"]
            },
            {
                name: "Galaxy Hải Phòng",
                showtimes: ["09:30", "12:30", "15:30"]
            },
            {
                name: "Galaxy Nguyễn Văn Quá",
                showtimes: ["10:30", "13:30", "16:30"]
            },
            {
                name: "Galaxy Co.opXtra Linh Trung",
                showtimes: ["11:30", "14:30", "17:30"]
            },
            {
                name: "Galaxy Trường Chinh",
                showtimes: ["12:00", "15:00", "18:00"]
            }
        ]
    },
    {
        id: 12,
        image: "https://cdn.galaxycine.vn/media/2024/8/2/borderlands-500_1722573445540.jpg",
        title: "Quái Vật Không Gian: Romulus",
        soT: "T18",
        time: "118 phút",
        date: "16/08/2024",
        numberStar: "8.7 (187 votes)",
        nation: "Mỹ",
        manufacturer: "20th Century Studios",
        genre: ["Hành Động", "Giả Tưởng", "Phiêu Lưu"],
        director: "Fede Alvarez",
        performer: ["Cailee Spaeny", "Isabela Merced", "Spike Fearn"],
        status: "Sắp chiếu",
        content: "Phần phim mới nhất của thương hiệu phim quái vật gây ám ảnh nhất lịch sử điện ảnh theo chân một nhóm người khai hoang lục địa, đang tìm kiếm những gì còn sót lại trên một trạm vũ trụ bỏ hoang. Thế nhưng mọi chuyện trở thành một thảm kịch khi họ phải đối mặt với những thực thể quái vật ghê tởm nhất, và chuyến đi đầy hi vọng lại trở thành cơn ác mộng đối với tất cả mọi người.",
        showtimes: "16/08/2024 - 16/09/2024",
        theater: [
            {
                name: "Galaxy Sala",
                showtimes: ["09:00", "12:00", "15:00"]
            },
            {
                name: "Galaxy Đà Nẵng",
                showtimes: ["10:00", "13:00", "16:00"]
            },
            {
                name: "Galaxy Trung Chánh",
                showtimes: ["11:00", "14:00", "17:00"]
            },
            {
                name: "Galaxy Hải Phòng",
                showtimes: ["09:30", "12:30", "15:30"]
            },
            {
                name: "Galaxy Nguyễn Văn Quá",
                showtimes: ["10:30", "13:30", "16:30"]
            },
            {
                name: "Galaxy Co.opXtra Linh Trung",
                showtimes: ["11:30", "14:30", "17:30"]
            },
            {
                name: "Galaxy Trường Chinh",
                showtimes: ["12:00", "15:00", "18:00"]
            }
        ]
    },
    {
        id: 13,
        image: "https://cdn.galaxycine.vn/media/2024/8/20/da-nu-bao-thu-500_1724135682786.jpg",
        title: "Quái Vật Không Gian: Romulus",
        soT: "T18",
        time: "118 phút",
        date: "16/08/2024",
        numberStar: "8.7 (187 votes)",
        nation: "Mỹ",
        manufacturer: "20th Century Studios",
        genre: ["Hành Động", "Giả Tưởng", "Phiêu Lưu"],
        director: "Fede Alvarez",
        performer: ["Cailee Spaeny", "Isabela Merced", "Spike Fearn"],
        status: "Sắp chiếu",
        content: "Phần phim mới nhất của thương hiệu phim quái vật gây ám ảnh nhất lịch sử điện ảnh theo chân một nhóm người khai hoang lục địa, đang tìm kiếm những gì còn sót lại trên một trạm vũ trụ bỏ hoang. Thế nhưng mọi chuyện trở thành một thảm kịch khi họ phải đối mặt với những thực thể quái vật ghê tởm nhất, và chuyến đi đầy hi vọng lại trở thành cơn ác mộng đối với tất cả mọi người.",
        showtimes: "16/08/2024 - 16/09/2024",
        theater: [
            {
                name: "Galaxy Sala",
                showtimes: ["09:00", "12:00", "15:00"]
            },
            {
                name: "Galaxy Đà Nẵng",
                showtimes: ["10:00", "13:00", "16:00"]
            },
            {
                name: "Galaxy Trung Chánh",
                showtimes: ["11:00", "14:00", "17:00"]
            },
            {
                name: "Galaxy Hải Phòng",
                showtimes: ["09:30", "12:30", "15:30"]
            },
            {
                name: "Galaxy Nguyễn Văn Quá",
                showtimes: ["10:30", "13:30", "16:30"]
            },
            {
                name: "Galaxy Co.opXtra Linh Trung",
                showtimes: ["11:30", "14:30", "17:30"]
            },
            {
                name: "Galaxy Trường Chinh",
                showtimes: ["12:00", "15:00", "18:00"]
            }
        ]
    },
    {
        id: 14,
        image: "https://cdn.galaxycine.vn/media/2024/8/12/harold-500_1723454759393.jpg",
        title: "Quái Vật Không Gian: Romulus",
        soT: "T18",
        time: "118 phút",
        date: "16/08/2024",
        numberStar: "8.7 (187 votes)",
        nation: "Mỹ",
        manufacturer: "20th Century Studios",
        genre: ["Hành Động", "Giả Tưởng", "Phiêu Lưu"],
        director: "Fede Alvarez",
        performer: ["Cailee Spaeny", "Isabela Merced", "Spike Fearn"],
        status: "Sắp chiếu",
        content: "Phần phim mới nhất của thương hiệu phim quái vật gây ám ảnh nhất lịch sử điện ảnh theo chân một nhóm người khai hoang lục địa, đang tìm kiếm những gì còn sót lại trên một trạm vũ trụ bỏ hoang. Thế nhưng mọi chuyện trở thành một thảm kịch khi họ phải đối mặt với những thực thể quái vật ghê tởm nhất, và chuyến đi đầy hi vọng lại trở thành cơn ác mộng đối với tất cả mọi người.",
        showtimes: "16/08/2024 - 16/09/2024",
        theater: [
            {
                name: "Galaxy Sala",
                showtimes: ["09:00", "12:00", "15:00"]
            },
            {
                name: "Galaxy Đà Nẵng",
                showtimes: ["10:00", "13:00", "16:00"]
            },
            {
                name: "Galaxy Trung Chánh",
                showtimes: ["11:00", "14:00", "17:00"]
            },
            {
                name: "Galaxy Hải Phòng",
                showtimes: ["09:30", "12:30", "15:30"]
            },
            {
                name: "Galaxy Nguyễn Văn Quá",
                showtimes: ["10:30", "13:30", "16:30"]
            },
            {
                name: "Galaxy Co.opXtra Linh Trung",
                showtimes: ["11:30", "14:30", "17:30"]
            },
            {
                name: "Galaxy Trường Chinh",
                showtimes: ["12:00", "15:00", "18:00"]
            }
        ]
    },
    {
        id: 15,
        image: "https://cdn.galaxycine.vn/media/2024/8/8/lam-giau-voi-ma-500_1723108879501.jpg",
        title: "Quái Vật Không Gian: Romulus",
        soT: "T18",
        time: "118 phút",
        date: "16/08/2024",
        numberStar: "8.7 (187 votes)",
        nation: "Mỹ",
        manufacturer: "20th Century Studios",
        genre: ["Hành Động", "Giả Tưởng", "Phiêu Lưu"],
        director: "Fede Alvarez",
        performer: ["Cailee Spaeny", "Isabela Merced", "Spike Fearn"],
        status: "Sắp chiếu",
        content: "Phần phim mới nhất của thương hiệu phim quái vật gây ám ảnh nhất lịch sử điện ảnh theo chân một nhóm người khai hoang lục địa, đang tìm kiếm những gì còn sót lại trên một trạm vũ trụ bỏ hoang. Thế nhưng mọi chuyện trở thành một thảm kịch khi họ phải đối mặt với những thực thể quái vật ghê tởm nhất, và chuyến đi đầy hi vọng lại trở thành cơn ác mộng đối với tất cả mọi người.",
        showtimes: "16/08/2024 - 16/09/2024",
        theater: [
            {
                name: "Galaxy Sala",
                showtimes: ["09:00", "12:00", "15:00"]
            },
            {
                name: "Galaxy Đà Nẵng",
                showtimes: ["10:00", "13:00", "16:00"]
            },
            {
                name: "Galaxy Trung Chánh",
                showtimes: ["11:00", "14:00", "17:00"]
            },
            {
                name: "Galaxy Hải Phòng",
                showtimes: ["09:30", "12:30", "15:30"]
            },
            {
                name: "Galaxy Nguyễn Văn Quá",
                showtimes: ["10:30", "13:30", "16:30"]
            },
            {
                name: "Galaxy Co.opXtra Linh Trung",
                showtimes: ["11:30", "14:30", "17:30"]
            },
            {
                name: "Galaxy Trường Chinh",
                showtimes: ["12:00", "15:00", "18:00"]
            }
        ]
    },
    {
        id: 16,
        image: "https://cdn.galaxycine.vn/media/2024/8/19/little-eggs-500_1724053385143.jpg",
        title: "Quái Vật Không Gian: Romulus",
        soT: "T18",
        time: "118 phút",
        date: "16/08/2024",
        numberStar: "8.7 (187 votes)",
        nation: "Mỹ",
        manufacturer: "20th Century Studios",
        genre: ["Hành Động", "Giả Tưởng", "Phiêu Lưu"],
        director: "Fede Alvarez",
        performer: ["Cailee Spaeny", "Isabela Merced", "Spike Fearn"],
        status: "Sắp chiếu",
        content: "Phần phim mới nhất của thương hiệu phim quái vật gây ám ảnh nhất lịch sử điện ảnh theo chân một nhóm người khai hoang lục địa, đang tìm kiếm những gì còn sót lại trên một trạm vũ trụ bỏ hoang. Thế nhưng mọi chuyện trở thành một thảm kịch khi họ phải đối mặt với những thực thể quái vật ghê tởm nhất, và chuyến đi đầy hi vọng lại trở thành cơn ác mộng đối với tất cả mọi người.",
        showtimes: "16/08/2024 - 16/09/2024",
        theater: [
            {
                name: "Galaxy Sala",
                showtimes: ["09:00", "12:00", "15:00"]
            },
            {
                name: "Galaxy Đà Nẵng",
                showtimes: ["10:00", "13:00", "16:00"]
            },
            {
                name: "Galaxy Trung Chánh",
                showtimes: ["11:00", "14:00", "17:00"]
            },
            {
                name: "Galaxy Hải Phòng",
                showtimes: ["09:30", "12:30", "15:30"]
            },
            {
                name: "Galaxy Nguyễn Văn Quá",
                showtimes: ["10:30", "13:30", "16:30"]
            },
            {
                name: "Galaxy Co.opXtra Linh Trung",
                showtimes: ["11:30", "14:30", "17:30"]
            },
            {
                name: "Galaxy Trường Chinh",
                showtimes: ["12:00", "15:00", "18:00"]
            }
        ]
    },
    // Them phần xem thêm
    {
        id: 17,
        image: "https://cdn.galaxycine.vn/media/2024/8/19/little-eggs-500_1724053385143.jpg",
        title: "Quái Vật Không Gian: Romulus",
        soT: "T18",
        time: "118 phút",
        date: "16/08/2024",
        numberStar: "8.7 (187 votes)",
        nation: "Mỹ",
        manufacturer: "20th Century Studios",
        genre: ["Hành Động", "Giả Tưởng", "Phiêu Lưu"],
        director: "Fede Alvarez",
        performer: ["Cailee Spaeny", "Isabela Merced", "Spike Fearn"],
        status: "Sắp chiếu",
        content: "Phần phim mới nhất của thương hiệu phim quái vật gây ám ảnh nhất lịch sử điện ảnh theo chân một nhóm người khai hoang lục địa, đang tìm kiếm những gì còn sót lại trên một trạm vũ trụ bỏ hoang. Thế nhưng mọi chuyện trở thành một thảm kịch khi họ phải đối mặt với những thực thể quái vật ghê tởm nhất, và chuyến đi đầy hi vọng lại trở thành cơn ác mộng đối với tất cả mọi người.",
        showtimes: "16/08/2024 - 16/09/2024",
        theater: [
            {
                name: "Galaxy Sala",
                showtimes: ["09:00", "12:00", "15:00"]
            },
            {
                name: "Galaxy Đà Nẵng",
                showtimes: ["10:00", "13:00", "16:00"]
            },
            {
                name: "Galaxy Trung Chánh",
                showtimes: ["11:00", "14:00", "17:00"]
            },
            {
                name: "Galaxy Hải Phòng",
                showtimes: ["09:30", "12:30", "15:30"]
            },
            {
                name: "Galaxy Nguyễn Văn Quá",
                showtimes: ["10:30", "13:30", "16:30"]
            },
            {
                name: "Galaxy Co.opXtra Linh Trung",
                showtimes: ["11:30", "14:30", "17:30"]
            },
            {
                name: "Galaxy Trường Chinh",
                showtimes: ["12:00", "15:00", "18:00"]
            }
        ]
    },
    {
        id: 18,
        image: "https://cdn.galaxycine.vn/media/2024/8/19/little-eggs-500_1724053385143.jpg",
        title: "Quái Vật Không Gian: Romulus",
        soT: "T18",
        time: "118 phút",
        date: "16/08/2024",
        numberStar: "8.7 (187 votes)",
        nation: "Mỹ",
        manufacturer: "20th Century Studios",
        genre: ["Hành Động", "Giả Tưởng", "Phiêu Lưu"],
        director: "Fede Alvarez",
        performer: ["Cailee Spaeny", "Isabela Merced", "Spike Fearn"],
        status: "Sắp chiếu",
        content: "Phần phim mới nhất của thương hiệu phim quái vật gây ám ảnh nhất lịch sử điện ảnh theo chân một nhóm người khai hoang lục địa, đang tìm kiếm những gì còn sót lại trên một trạm vũ trụ bỏ hoang. Thế nhưng mọi chuyện trở thành một thảm kịch khi họ phải đối mặt với những thực thể quái vật ghê tởm nhất, và chuyến đi đầy hi vọng lại trở thành cơn ác mộng đối với tất cả mọi người.",
        showtimes: "16/08/2024 - 16/09/2024",
        theater: [
            {
                name: "Galaxy Sala",
                showtimes: ["09:00", "12:00", "15:00"]
            },
            {
                name: "Galaxy Đà Nẵng",
                showtimes: ["10:00", "13:00", "16:00"]
            },
            {
                name: "Galaxy Trung Chánh",
                showtimes: ["11:00", "14:00", "17:00"]
            },
            {
                name: "Galaxy Hải Phòng",
                showtimes: ["09:30", "12:30", "15:30"]
            },
            {
                name: "Galaxy Nguyễn Văn Quá",
                showtimes: ["10:30", "13:30", "16:30"]
            },
            {
                name: "Galaxy Co.opXtra Linh Trung",
                showtimes: ["11:30", "14:30", "17:30"]
            },
            {
                name: "Galaxy Trường Chinh",
                showtimes: ["12:00", "15:00", "18:00"]
            }
        ]
    },
    {
        id: 19,
        image: "https://cdn.galaxycine.vn/media/2024/8/19/little-eggs-500_1724053385143.jpg",
        title: "Quái Vật Không Gian: Romulus",
        soT: "T18",
        time: "118 phút",
        date: "16/08/2024",
        numberStar: "8.7 (187 votes)",
        nation: "Mỹ",
        manufacturer: "20th Century Studios",
        genre: ["Hành Động", "Giả Tưởng", "Phiêu Lưu"],
        director: "Fede Alvarez",
        performer: ["Cailee Spaeny", "Isabela Merced", "Spike Fearn"],
        status: "Sắp chiếu",
        content: "Phần phim mới nhất của thương hiệu phim quái vật gây ám ảnh nhất lịch sử điện ảnh theo chân một nhóm người khai hoang lục địa, đang tìm kiếm những gì còn sót lại trên một trạm vũ trụ bỏ hoang. Thế nhưng mọi chuyện trở thành một thảm kịch khi họ phải đối mặt với những thực thể quái vật ghê tởm nhất, và chuyến đi đầy hi vọng lại trở thành cơn ác mộng đối với tất cả mọi người.",
        showtimes: "16/08/2024 - 16/09/2024",
        theater: [
            {
                name: "Galaxy Sala",
                showtimes: ["09:00", "12:00", "15:00"]
            },
            {
                name: "Galaxy Đà Nẵng",
                showtimes: ["10:00", "13:00", "16:00"]
            },
            {
                name: "Galaxy Trung Chánh",
                showtimes: ["11:00", "14:00", "17:00"]
            },
            {
                name: "Galaxy Hải Phòng",
                showtimes: ["09:30", "12:30", "15:30"]
            },
            {
                name: "Galaxy Nguyễn Văn Quá",
                showtimes: ["10:30", "13:30", "16:30"]
            },
            {
                name: "Galaxy Co.opXtra Linh Trung",
                showtimes: ["11:30", "14:30", "17:30"]
            },
            {
                name: "Galaxy Trường Chinh",
                showtimes: ["12:00", "15:00", "18:00"]
            }
        ]
    },
    {
        id: 20,
        image: "https://cdn.galaxycine.vn/media/2024/8/19/little-eggs-500_1724053385143.jpg",
        title: "Quái Vật Không Gian: Romulus",
        soT: "T18",
        time: "118 phút",
        date: "16/08/2024",
        numberStar: "8.7 (187 votes)",
        nation: "Mỹ",
        manufacturer: "20th Century Studios",
        genre: ["Hành Động", "Giả Tưởng", "Phiêu Lưu"],
        director: "Fede Alvarez",
        performer: ["Cailee Spaeny", "Isabela Merced", "Spike Fearn"],
        status: "Sắp chiếu",
        content: "Phần phim mới nhất của thương hiệu phim quái vật gây ám ảnh nhất lịch sử điện ảnh theo chân một nhóm người khai hoang lục địa, đang tìm kiếm những gì còn sót lại trên một trạm vũ trụ bỏ hoang. Thế nhưng mọi chuyện trở thành một thảm kịch khi họ phải đối mặt với những thực thể quái vật ghê tởm nhất, và chuyến đi đầy hi vọng lại trở thành cơn ác mộng đối với tất cả mọi người.",
        showtimes: "16/08/2024 - 16/09/2024",
        theater: [
            {
                name: "Galaxy Sala",
                showtimes: ["09:00", "12:00", "15:00"]
            },
            {
                name: "Galaxy Đà Nẵng",
                showtimes: ["10:00", "13:00", "16:00"]
            },
            {
                name: "Galaxy Trung Chánh",
                showtimes: ["11:00", "14:00", "17:00"]
            },
            {
                name: "Galaxy Hải Phòng",
                showtimes: ["09:30", "12:30", "15:30"]
            },
            {
                name: "Galaxy Nguyễn Văn Quá",
                showtimes: ["10:30", "13:30", "16:30"]
            },
            {
                name: "Galaxy Co.opXtra Linh Trung",
                showtimes: ["11:30", "14:30", "17:30"]
            },
            {
                name: "Galaxy Trường Chinh",
                showtimes: ["12:00", "15:00", "18:00"]
            }
        ]
    },
    {
        id: 21,
        image: "https://cdn.galaxycine.vn/media/2024/8/15/gieng-qu-500_1723693934297.jpg",
        title: "Quái Vật Không Gian: Romulus",
        soT: "T18",
        time: "118 phút",
        date: "16/08/2024",
        numberStar: "8.7 (187 votes)",
        nation: "Mỹ",
        manufacturer: "20th Century Studios",
        genre: ["Hành Động", "Giả Tưởng", "Phiêu Lưu"],
        director: "Fede Alvarez",
        performer: ["Cailee Spaeny", "Isabela Merced", "Spike Fearn"],
        status: "Đang chiếu",
        content: "Phần phim mới nhất của thương hiệu phim quái vật gây ám ảnh nhất lịch sử điện ảnh theo chân một nhóm người khai hoang lục địa, đang tìm kiếm những gì còn sót lại trên một trạm vũ trụ bỏ hoang. Thế nhưng mọi chuyện trở thành một thảm kịch khi họ phải đối mặt với những thực thể quái vật ghê tởm nhất, và chuyến đi đầy hi vọng lại trở thành cơn ác mộng đối với tất cả mọi người.",
        showtimes: "16/08/2024 - 16/09/2024",
        theater: [
            {
                name: "Galaxy Sala",
                showtimes: ["09:00", "12:00", "15:00"]
            },
            {
                name: "Galaxy Đà Nẵng",
                showtimes: ["10:00", "13:00", "16:00"]
            },
            {
                name: "Galaxy Trung Chánh",
                showtimes: ["11:00", "14:00", "17:00"]
            },
            {
                name: "Galaxy Hải Phòng",
                showtimes: ["09:30", "12:30", "15:30"]
            },
            {
                name: "Galaxy Nguyễn Văn Quá",
                showtimes: ["10:30", "13:30", "16:30"]
            },
            {
                name: "Galaxy Co.opXtra Linh Trung",
                showtimes: ["11:30", "14:30", "17:30"]
            },
            {
                name: "Galaxy Trường Chinh",
                showtimes: ["12:00", "15:00", "18:00"]
            }
        ]
    },
    {
        id: 22,
        image: "https://cdn.galaxycine.vn/media/2024/8/15/gieng-qu-500_1723693934297.jpg",
        title: "Quái Vật Không Gian: Romulus",
        soT: "T18",
        time: "118 phút",
        date: "16/08/2024",
        numberStar: "8.7 (187 votes)",
        nation: "Mỹ",
        manufacturer: "20th Century Studios",
        genre: ["Hành Động", "Giả Tưởng", "Phiêu Lưu"],
        director: "Fede Alvarez",
        performer: ["Cailee Spaeny", "Isabela Merced", "Spike Fearn"],
        status: "Đang chiếu",
        content: "Phần phim mới nhất của thương hiệu phim quái vật gây ám ảnh nhất lịch sử điện ảnh theo chân một nhóm người khai hoang lục địa, đang tìm kiếm những gì còn sót lại trên một trạm vũ trụ bỏ hoang. Thế nhưng mọi chuyện trở thành một thảm kịch khi họ phải đối mặt với những thực thể quái vật ghê tởm nhất, và chuyến đi đầy hi vọng lại trở thành cơn ác mộng đối với tất cả mọi người.",
        showtimes: "16/08/2024 - 16/09/2024",
        theater: [
            {
                name: "Galaxy Sala",
                showtimes: ["09:00", "12:00", "15:00"]
            },
            {
                name: "Galaxy Đà Nẵng",
                showtimes: ["10:00", "13:00", "16:00"]
            },
            {
                name: "Galaxy Trung Chánh",
                showtimes: ["11:00", "14:00", "17:00"]
            },
            {
                name: "Galaxy Hải Phòng",
                showtimes: ["09:30", "12:30", "15:30"]
            },
            {
                name: "Galaxy Nguyễn Văn Quá",
                showtimes: ["10:30", "13:30", "16:30"]
            },
            {
                name: "Galaxy Co.opXtra Linh Trung",
                showtimes: ["11:30", "14:30", "17:30"]
            },
            {
                name: "Galaxy Trường Chinh",
                showtimes: ["12:00", "15:00", "18:00"]
            }
        ]
    },
    {
        id: 23,
        image: "https://cdn.galaxycine.vn/media/2024/8/15/gieng-qu-500_1723693934297.jpg",
        title: "Quái Vật Không Gian: Romulus",
        soT: "T18",
        time: "118 phút",
        date: "16/08/2024",
        numberStar: "8.7 (187 votes)",
        nation: "Mỹ",
        manufacturer: "20th Century Studios",
        genre: ["Hành Động", "Giả Tưởng", "Phiêu Lưu"],
        director: "Fede Alvarez",
        performer: ["Cailee Spaeny", "Isabela Merced", "Spike Fearn"],
        status: "Đang chiếu",
        content: "Phần phim mới nhất của thương hiệu phim quái vật gây ám ảnh nhất lịch sử điện ảnh theo chân một nhóm người khai hoang lục địa, đang tìm kiếm những gì còn sót lại trên một trạm vũ trụ bỏ hoang. Thế nhưng mọi chuyện trở thành một thảm kịch khi họ phải đối mặt với những thực thể quái vật ghê tởm nhất, và chuyến đi đầy hi vọng lại trở thành cơn ác mộng đối với tất cả mọi người.",
        showtimes: "16/08/2024 - 16/09/2024",
        theater: [
            {
                name: "Galaxy Sala",
                showtimes: ["09:00", "12:00", "15:00"]
            },
            {
                name: "Galaxy Đà Nẵng",
                showtimes: ["10:00", "13:00", "16:00"]
            },
            {
                name: "Galaxy Trung Chánh",
                showtimes: ["11:00", "14:00", "17:00"]
            },
            {
                name: "Galaxy Hải Phòng",
                showtimes: ["09:30", "12:30", "15:30"]
            },
            {
                name: "Galaxy Nguyễn Văn Quá",
                showtimes: ["10:30", "13:30", "16:30"]
            },
            {
                name: "Galaxy Co.opXtra Linh Trung",
                showtimes: ["11:30", "14:30", "17:30"]
            },
            {
                name: "Galaxy Trường Chinh",
                showtimes: ["12:00", "15:00", "18:00"]
            }
        ]
    },
    {
        id: 24,
        image: "https://cdn.galaxycine.vn/media/2024/8/15/gieng-qu-500_1723693934297.jpg",
        title: "Quái Vật Không Gian: Romulus",
        soT: "T18",
        time: "118 phút",
        date: "16/08/2024",
        numberStar: "8.7 (187 votes)",
        nation: "Mỹ",
        manufacturer: "20th Century Studios",
        genre: ["Hành Động", "Giả Tưởng", "Phiêu Lưu"],
        director: "Fede Alvarez",
        performer: ["Cailee Spaeny", "Isabela Merced", "Spike Fearn"],
        status: "Đang chiếu",
        content: "Phần phim mới nhất của thương hiệu phim quái vật gây ám ảnh nhất lịch sử điện ảnh theo chân một nhóm người khai hoang lục địa, đang tìm kiếm những gì còn sót lại trên một trạm vũ trụ bỏ hoang. Thế nhưng mọi chuyện trở thành một thảm kịch khi họ phải đối mặt với những thực thể quái vật ghê tởm nhất, và chuyến đi đầy hi vọng lại trở thành cơn ác mộng đối với tất cả mọi người.",
        showtimes: "16/08/2024 - 16/09/2024",
        theater: [
            {
                name: "Galaxy Sala",
                showtimes: ["09:00", "12:00", "15:00"]
            },
            {
                name: "Galaxy Đà Nẵng",
                showtimes: ["10:00", "13:00", "16:00"]
            },
            {
                name: "Galaxy Trung Chánh",
                showtimes: ["11:00", "14:00", "17:00"]
            },
            {
                name: "Galaxy Hải Phòng",
                showtimes: ["09:30", "12:30", "15:30"]
            },
            {
                name: "Galaxy Nguyễn Văn Quá",
                showtimes: ["10:30", "13:30", "16:30"]
            },
            {
                name: "Galaxy Co.opXtra Linh Trung",
                showtimes: ["11:30", "14:30", "17:30"]
            },
            {
                name: "Galaxy Trường Chinh",
                showtimes: ["12:00", "15:00", "18:00"]
            }
        ]
    },


];

export default movies;
  