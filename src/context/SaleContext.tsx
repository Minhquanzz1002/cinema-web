import { AdminShowTimeForSale, Seat } from '@/modules/showTimes/interface';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AdminMovie } from '@/modules/movies/interface';
import { BaseProductWithPrice } from '@/modules/products/interface';
import { CustomerWithNameAndPhone } from '@/modules/customers/interface';
import { useCreateOrderByEmployee, useUpdateProductInOrderByEmployee } from '@/modules/orders/repository';
import { OrderResponseCreated } from '@/modules/orders/interface';

export interface SelectedProduct {
    quantity: number;
    product: BaseProductWithPrice;
}

interface SaleContextType {
    movie: AdminMovie | null;
    showTime: AdminShowTimeForSale | null;
    selectedSeats: Seat[];
    addSeat: (seat: Seat) => void;
    removeSeat: (seatId: number) => void;
    clearSeats: () => void;
    selectedProducts: SelectedProduct[];
    addProduct: (product: BaseProductWithPrice) => void;
    removeProduct: (productId: number) => void;
    updateProductQuantity: (productId: number, quantity: number) => void;
    clearProducts: () => void;
    customer: CustomerWithNameAndPhone | null;
    setCustomer: (customer: CustomerWithNameAndPhone | null) => void;
    clearCustomer: () => void;
    setMovieAndShowTime: (movie: AdminMovie | null, showTime: AdminShowTimeForSale | null) => void;
    proceedToSeatSelection: () => void;
    proceedToComboSelection: () => void;
    proceedToPaymentSelection: () => void;
    isLoadingRedirect: boolean;
    totalDiscount: number;
    order: OrderResponseCreated | null;
    setOrder: (order: OrderResponseCreated | null) => void;
    zpAppTransId: string | null;
    setZpAppTransId: (zpAppTransId: string | null) => void;
}

const SaleContext = createContext<SaleContextType>({} as SaleContextType);

export const useSaleContext = () => {
    const context = useContext(SaleContext);
    if (!context) {
        throw new Error('useSaleContext must be used within a SaleProvider');
    }
    return context;
};

interface SaleProviderProps {
    children: React.ReactNode;
}

const SaleProvider = ({ children }: SaleProviderProps) => {
    const router = useRouter();
    const pathname = usePathname();
    const [isClient, setIsClient] = useState(false);
    const [hasLeftFlow, setHasLeftFlow] = useState(false);

    const [movie, setMovie] = useState<AdminMovie | null>(null);

    const [showTime, setShowTime] = useState<AdminShowTimeForSale | null>(null);

    const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);

    const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);

    const [customer, setCustomerState] = useState<CustomerWithNameAndPhone | null>(null);

    const [isLoadingRedirect, setIsLoadingRedirect] = useState<boolean>(false);

    const [totalDiscount, setTotalDiscount] = useState<number>(0);

    const createOrder = useCreateOrderByEmployee();
    const updateProductInOrder = useUpdateProductInOrderByEmployee();

    const [order, setOrderState] = useState<OrderResponseCreated | null>(null);

    const [zpAppTransId, setZpAppTransIdState] = useState<string | null>(null);

    const validFlowRoutes = useMemo(() => [
        '/admin/sales/choose-seat',
        '/admin/sales/choose-combo',
        '/admin/sales/payment'
    ], []);

    const isValidFlowRoute = useCallback((path: string) => {
        return validFlowRoutes.includes(path);
    }, [validFlowRoutes]);

    const handleLeaveFlow = useCallback(() => {
        console.log('handleLeaveFlow rời');
        if (hasLeftFlow) return; // Tránh xử lý nhiều lần

        // Hủy đơn hàng nếu đã tạo
        if (order) {
            // Gọi API hủy đơn hàng
            // cancelOrder.mutateAsync({ orderId: order.id });
        }

        setMovie(null);
        setShowTime(null);
        setSelectedSeats([]);
        setSelectedProducts([]);
        setCustomerState(null);
        setOrderState(null);
        setTotalDiscount(0);

        // Clear localStorage
        localStorage.removeItem('selectedMovie');
        localStorage.removeItem('selectedShowTime');
        localStorage.removeItem('selectedSeats');
        localStorage.removeItem('selectedProducts');
        localStorage.removeItem('selectedCustomer');

        setHasLeftFlow(true);
    }, [order, hasLeftFlow]);

    useEffect(() => {
        if (!pathname || !isClient) return;

        if (!isValidFlowRoute(pathname)) {
            handleLeaveFlow();
        } else {
            setHasLeftFlow(false);
        }
    }, [pathname, isClient, isValidFlowRoute, handleLeaveFlow]);

    useEffect(() => {
        setIsClient(true);
        const savedMovie = localStorage.getItem('selectedMovie');
        const savedShowTime = localStorage.getItem('selectedShowTime');
        const savedSelectedSeats = localStorage.getItem('selectedSeats');

        if (savedMovie) setMovie(JSON.parse(savedMovie));
        if (savedShowTime) setShowTime(JSON.parse(savedShowTime));
        if (savedSelectedSeats) setSelectedSeats(JSON.parse(savedSelectedSeats));
    }, []);

    useEffect(() => {
        if (!isClient) return;

        if (movie) {
            localStorage.setItem('selectedMovie', JSON.stringify(movie));
        } else {
            localStorage.removeItem('selectedMovie');

        }
    }, [movie, isClient]);

    useEffect(() => {
        if (!isClient) return;

        if (showTime) {
            localStorage.setItem('selectedShowTime', JSON.stringify(showTime));
        } else {
            localStorage.removeItem('selectedShowTime');
        }
    }, [showTime, isClient]);


    useEffect(() => {
        if (!isClient) return;

        if (selectedSeats.length > 0) {
            localStorage.setItem('selectedSeats', JSON.stringify(selectedSeats));
        } else {
            localStorage.removeItem('selectedSeats');
        }
    }, [selectedSeats, isClient]);

    useEffect(() => {
        if (!isClient) return;

        if (selectedProducts.length > 0) {
            localStorage.setItem('selectedProducts', JSON.stringify(selectedProducts));
        } else {
            localStorage.removeItem('selectedProducts');
        }
    }, [selectedProducts, isClient]);

    useEffect(() => {
        if (!isClient) return;
        if (customer) {
            localStorage.setItem('selectedCustomer', JSON.stringify(customer));
        } else {
            localStorage.removeItem('selectedCustomer');
        }
    }, [customer, isClient]);

    const setCustomer = useCallback((newCustomer: CustomerWithNameAndPhone | null) => {
        setCustomerState(newCustomer);
    }, []);

    const clearCustomer = useCallback(() => {
        setCustomerState(null);
        localStorage.removeItem('selectedCustomer');
    }, []);

    const setMovieAndShowTime = useCallback((
        newMovie: AdminMovie | null,
        newShowTime: AdminShowTimeForSale | null,
    ) => {
        setMovie(newMovie);
        setShowTime(newShowTime);
        setSelectedSeats([]);
        setSelectedProducts([]);
    }, []);

    const proceedToSeatSelection = useCallback(() => {
        if (movie && showTime) {
            router.push('/admin/sales/choose-seat');
        }
    }, [movie, showTime, router]);

    const proceedToComboSelection = useCallback(async () => {
        if (movie && showTime && selectedSeats.length > 0) {
            setIsLoadingRedirect(true);
            const { data } = await createOrder.mutateAsync({
                customerId: customer?.id,
                showTimeId: showTime.id,
                seatIds: selectedSeats.map(seat => seat.id),
            });
            if (data) {
                setTotalDiscount(data.totalDiscount);
                setOrderState(data);
            }
            setIsLoadingRedirect(false);
            router.push('/admin/sales/choose-combo');
        }
    }, [movie, showTime, selectedSeats, createOrder, customer?.id, router]);

    const proceedToPaymentSelection = useCallback(async () => {
        if (movie && showTime && selectedSeats.length > 0 && order) {
            setIsLoadingRedirect(true);
            const { data } = await updateProductInOrder.mutateAsync({
                orderId: order.id,
                data: {
                    products: selectedProducts.map(product => ({
                        id: product.product.id,
                        quantity: product.quantity,
                    }))
                }
            });

            if (data) {
                setTotalDiscount(data.totalDiscount);
                setOrderState(data);
            }
            setIsLoadingRedirect(false);
            router.push('/admin/sales/payment');
        }
    }, [movie, showTime, selectedSeats.length, order, updateProductInOrder, selectedProducts, router]);

    const addSeat = useCallback((seat: Seat) => {
        setSelectedSeats(prev => {
            if (prev.some(s => s.id === seat.id)) {
                return prev;
            }
            return [...prev, seat];
        });
    }, []);

    const removeSeat = useCallback((seatId: number) => {
        setSelectedSeats(prev => prev.filter(seat => seat.id !== seatId));
    }, []);

    const clearSeats = useCallback(() => {
        setSelectedSeats([]);
    }, []);

    const addProduct = useCallback((product: BaseProductWithPrice) => {
        setSelectedProducts(prev => {
            const existingProductIndex = prev.findIndex(p => p.product.id === product.id);

            if (existingProductIndex >= 0) {
                const newProducts = [...prev];
                newProducts[existingProductIndex] = {
                    ...newProducts[existingProductIndex],
                    quantity: newProducts[existingProductIndex].quantity + 1,
                };
                return newProducts;
            }

            return [...prev, { product, quantity: 1 }];
        });
    }, []);

    const removeProduct = useCallback((productId: number) => {
        setSelectedProducts(prev =>
            prev.filter(item => item.product.id !== productId),
        );
    }, []);

    const updateProductQuantity = useCallback((productId: number, quantity: number) => {
        setSelectedProducts(prev => {
            if (quantity <= 0) {
                return prev.filter(item => item.product.id !== productId);
            }

            return prev.map(item =>
                item.product.id === productId
                    ? { ...item, quantity }
                    : item,
            );
        });
    }, []);

    const clearProducts = useCallback(() => {
        setSelectedProducts([]);
        localStorage.removeItem('selectedProducts');
    }, []);

    const setOrder = (order: OrderResponseCreated | null) => {
        setOrderState(order);
    };

    const setZpAppTransId = (zpAppTransId: string | null) => {
        setZpAppTransIdState(zpAppTransId);
    };

    const value = {
        movie,
        showTime,
        setMovieAndShowTime,
        proceedToSeatSelection,
        selectedSeats,
        addSeat,
        removeSeat,
        clearSeats,
        selectedProducts,
        addProduct,
        removeProduct,
        clearProducts,
        updateProductQuantity,
        proceedToComboSelection,
        proceedToPaymentSelection,
        customer,
        setCustomer,
        clearCustomer,
        isLoadingRedirect,
        totalDiscount,
        order,
        setOrder,
        zpAppTransId,
        setZpAppTransId,

    };

    return (
        <SaleContext.Provider value={value}>
            {children}
        </SaleContext.Provider>
    );
};

export default SaleProvider;
export { SaleContext };