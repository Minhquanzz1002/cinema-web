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
            { label: 'Diễn viên' },
            { label: 'Danh sách diễn viên' },
        ],
    },
    {
        label: 'Cập nhật phim',
        link: '^/admin/movies/[^/]+/edit$',
        breadcrumbTrail: [
            { label: 'Phim' },
            { label: 'Danh sách phim', link: '/admin/movies' },
            { label: 'Cập nhật' },
        ],
    },
    {
        label: 'Chi tiết phim',
        link: '^/admin/movies/[^/]+$',
        breadcrumbTrail: [
            { label: 'Phim' },
            { label: 'Danh sách phim', link: '/admin/movies' },
            { label: 'Chi tiết phim' },
        ],
    },
    {
        label: 'Thêm diễn viên',
        link: '^/admin/movies/actors/new$',
        breadcrumbTrail: [
            { label: 'Diễn viên' },
            { label: 'Danh sách diễn viên', link: '/admin/movies/actors' },
            { label: 'Thêm diễn viên' },
        ],
    },
    {
        label: 'Cập nhật diễn viên',
        link: '^/admin/movies/actors/[^/]+/edit$',
        breadcrumbTrail: [
            { label: 'Diễn viên' },
            { label: 'Danh sách diễn viên', link: '/admin/movies/actors' },
            { label: 'Cập nhật' },
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
        label: 'Quản lý giá vé',
        link: '^/admin/ticket-prices$',
        breadcrumbTrail: [
            { label: 'Giá vé' },
            { label: 'Danh sách giá vé' },
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
        label: 'Thêm CTKM',
        link: '^/admin/promotions/[^/]+/lines/new$',
        breadcrumbTrail: [
            { label: 'Khuyến mãi' },
            { label: 'Danh sách khuyến mãi', link: '/admin/promotions' },
            { label: 'Chi tiết', link: '/admin/promotions/[code]' },
            { label: 'Thêm chương trình' },
        ],
    },
    {
        label: 'Cập nhật CTKM',
        link: '^/admin/promotions/[^/]+/lines/[^/]+/edit$',
        breadcrumbTrail: [
            { label: 'Khuyến mãi' },
            { label: 'Danh sách khuyến mãi', link: '/admin/promotions' },
            { label: 'Chi tiết', link: '/admin/promotions/[code]' },
            { label: 'Cập nhật' },
        ],
    },
    {
        label: 'Quản lý khuyến mãi',
        link: '^/admin/promotions/new$',
        breadcrumbTrail: [
            { label: 'Khuyến mãi' },
            { label: 'Danh sách khuyến mãi', link: '/admin/promotions' },
            { label: 'Thêm mới' },
        ],
    },
    {
        label: 'Chi tiết khuyến mãi',
        link: '^/admin/promotions/[^/]+$',
        breadcrumbTrail: [
            { label: 'Khuyến mãi' },
            { label: 'Danh sách khuyến mãi', link: '/admin/promotions' },
            { label: 'Chi tiết' },
        ],
    },
    {
        label: 'Cập nhật khuyến mãi',
        link: '^/admin/promotions/[^/]+/edit$',
        breadcrumbTrail: [
            { label: 'Khuyến mãi' },
            { label: 'Danh sách khuyến mãi', link: '/admin/promotions' },
            { label: 'Cập nhật' },
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
        label: 'Quản lý hóa đơn',
        link: '^/admin/bills$',
        breadcrumbTrail: [
            { label: 'Hóa đơn' },
            { label: 'Danh sách hóa đơn' },
        ],
    },
    {
        label: 'Chi tiết hóa đơn',
        link: '^/admin/bills/[^/]+$',
        breadcrumbTrail: [
            { label: 'Đơn hàng' },
            { label: 'Danh sách hóa đơn', link: '/admin/bills' },
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
    {
        label: 'Bảng giá sản phẩm',
        link: '^/admin/products/prices$',
        breadcrumbTrail: [
            { label: 'Sản phẩm' },
            { label: 'Bảng giá' },
        ],
    },
    {
        label: 'Thêm sản phẩm',
        link: '^/admin/products/new$',
        breadcrumbTrail: [
            { label: 'Sản phẩm' },
            { label: 'Danh sách sản phẩm', link: '/admin/products' },
            { label: 'Thêm mới' },
        ],
    },
    {
        label: 'Chi tiết sản phẩm',
        link: '^/admin/products/[^/]+$',
        breadcrumbTrail: [
            { label: 'Sản phẩm' },
            { label: 'Danh sách sản phẩm', link: '/admin/products' },
            { label: 'Chi tiết sản phẩm' },
        ],
    },
    {
        label: 'Cập nhật sản phẩm',
        link: '^/admin/products/[^/]+/edit$',
        breadcrumbTrail: [
            { label: 'Sản phẩm' },
            { label: 'Danh sách sản phẩm', link: '/admin/products' },
            { label: 'Cập nhật' },
        ],
    },
    {
        label: 'Bán hàng',
        link: '^/admin/sales$',
        breadcrumbTrail: [
            { label: 'Bán hàng' },
        ],
    },
    {
        label: 'Chọn ghế',
        link: '^/admin/sales/choose-seat$',
        breadcrumbTrail: [
            { label: 'Bán hàng', link: "/admin/sales" },
            { label: 'Chọn ghế' },
        ],
    },
    {
        label: 'Chọn ghế',
        link: '^/admin/sales/choose-combo$',
        breadcrumbTrail: [
            { label: 'Bán hàng', link: "/admin/sales" },
            { label: 'Chọn ghế', link: "/admin/sales/choose-seat" },
            { label: 'Chọn combo' },
        ],
    },
    {
        label: 'Chọn ghế',
        link: '^/admin/sales/payment$',
        breadcrumbTrail: [
            { label: 'Bán hàng', link: "/admin/sales" },
            { label: 'Chọn ghế', link: "/admin/sales/choose-seat" },
            { label: 'Chọn combo', link: "/admin/sales/choose-combo" },
            { label: 'Thanh toán' },
        ],
    },
];