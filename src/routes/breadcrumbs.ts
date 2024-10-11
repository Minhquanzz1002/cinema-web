interface IBreadcrumb {
    label: string;
    link: string;
    breadcrumbTrail: { label: string; link?: string }[];
}

export const breadcrumbs: IBreadcrumb[] = [
    {
        label: 'Trang chủ',
        link: '^/admin/dashboard$',
        breadcrumbTrail: [
            { label: 'Trang chủ' },
        ],
    },
    {
        label: 'Quản lý phim',
        link: '^/admin/movies$',
        breadcrumbTrail: [
            { label: 'Phim' },
            { label: 'Danh sách phim' },
        ],
    },
    {
        label: 'Thêm phim',
        link: '^/admin/movies/new$',
        breadcrumbTrail: [
            { label: 'Phim' },
            { label: 'Danh sách phim', link: '/admin/movies' },
            { label: 'Thêm phim' },
        ],
    },
    {
        label: 'Quản lý diễn viên',
        link: '^/admin/movies/actors$',
        breadcrumbTrail: [
            { label: 'Thể loại' },
            { label: 'Danh sách diễn viên' },
        ],
    },
    {
        label: 'Quản lý đạo diễn',
        link: '^/admin/movies/directors$',
        breadcrumbTrail: [
            { label: 'Đạo diễn' },
            { label: 'Danh sách đạo diễn' },
        ],
    },
    {
        label: 'Quản lý khuyến mãi',
        link: '^/admin/promotions$',
        breadcrumbTrail: [
            { label: 'Khuyến mãi' },
            { label: 'Danh sách khuyến mãi' },
        ],
    },
    {
        label: 'Quản lý lịch chiếu',
        link: '^/admin/show-times$',
        breadcrumbTrail: [
            { label: 'Lịch chiếu' },
            { label: 'Danh sách lịch chiếu' },
        ],
    },
    {
        label: 'Quản lý đơn hàng',
        link: '^/admin/orders$',
        breadcrumbTrail: [
            { label: 'Đơn hàng' },
            { label: 'Danh sách đơn hàng' },
        ],
    },
    {
        label: 'Chi tiết đơn hàng',
        link: '^/admin/orders/[^/]+$',
        breadcrumbTrail: [
            { label: 'Đơn hàng' },
            { label: 'Danh sách đơn hàng', link: '/admin/orders' },
            { label: 'Chi tiết' },
        ],
    },
    {
        label: 'Quản lý sản phẩm',
        link: '^/admin/products$',
        breadcrumbTrail: [
            { label: 'Sản phẩm' },
            { label: 'Danh sách sản phẩm' },
        ],
    },
];