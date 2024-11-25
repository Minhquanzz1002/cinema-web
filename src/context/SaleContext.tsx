import { AdminShowTimeForSale, Seat } from '@/modules/showTimes/interface';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AdminMovie } from '@/modules/movies/interface';
import { BaseProductWithPrice } from '@/modules/products/interface';
import { CustomerWithNameAndPhone } from '@/modules/customers/interface';
import {
    useCancelOrderByEmployee,
    useCreateOrderByEmployee,
    useUpdateCustomerInOrderByEmployee,
    useUpdateProductInOrderByEmployee,
    useUpdateSeatInOrderByEmployee,
} from '@/modules/orders/repository';
import { OrderDetailInOrderCreated, OrderResponseCreated } from '@/modules/orders/interface';
import { useLocalStorage } from 'usehooks-ts';

export interface SelectedProduct {
    quantity: number;
    product: BaseProductWithPrice;
}

interface SaleSate {
    selectedMovie: AdminMovie | null;
    selectedShowTime: AdminShowTimeForSale | null;
    selectedSeats: Seat[];
    selectedTempSeats: Seat[];
    selectedProducts: SelectedProduct[];
    selectedProductGifts: SelectedProduct[];

    selectedCustomer: CustomerWithNameAndPhone | null;
    order: OrderResponseCreated | null;
    totalDiscount: number;
    isLoadingRedirect: boolean;
    zpAppTransId: string | null;
}

const convertOrderDetailToSelectedProduct = (orderDetail: OrderDetailInOrderCreated): SelectedProduct | null => {
    if (orderDetail.type !== 'PRODUCT' || !orderDetail.product) {
        return null;
    }

    return {
        quantity: orderDetail.quantity,
        product: {
            ...orderDetail.product,
            price: orderDetail.price,
        },
    };
};

interface SaleActions {
    // Movie & ShowTime actions
    updateMovieAndShowTime: (movie: AdminMovie | null, showTime: AdminShowTimeForSale | null) => void;

    // Navigation actions
    proceedToSeatSelection: () => void;
    proceedToComboSelection: () => void;
    proceedToPaymentSelection: () => void;

    // Seat actions
    addSeat: (seat: Seat) => void;
    removeSeat: (seatId: number) => void;
    // clearSeats: () => void;

    // Product actions
    addProduct: (product: BaseProductWithPrice) => void;
    updateProductQuantity: (productId: number, quantity: number) => void;

    // Customer actions
    updateCustomer: (customer: CustomerWithNameAndPhone | null) => void;
    clearCustomer: () => void;
    handleClearCustomer: () => void;

    // Order actions
    updateOrder: (order: OrderResponseCreated | null) => void;
    updateZpAppTransId: (zpAppTransId: string | null) => void;
    handleOrderExpired: () => Promise<void>;
}

type SaleContextType = SaleSate & SaleActions;

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
    // Flow Navigation State
    const router = useRouter();
    const pathname = usePathname();
    const [hasLeftFlow, setHasLeftFlow] = useState(false);

    // State
    const [selectedMovie, setSelectedMovie] = useLocalStorage<AdminMovie | null>('selectedMovie', null);
    const [selectedShowTime, setSelectedShowTime] = useLocalStorage<AdminShowTimeForSale | null>('selectedShowTime', null);
    const [selectedSeats, setSelectedSeats] = useLocalStorage<Seat[]>('selectedSeats', []);
    const [selectedTempSeats, setSelectedTempSeats] = useLocalStorage<Seat[]>('selectedTempSeats', []);
    const [selectedProducts, setSelectedProducts] = useLocalStorage<SelectedProduct[]>('selectedProducts', []);
    const [selectedProductGifts, setSelectedProductGifts] = useLocalStorage<SelectedProduct[]>('selectedProductGifts', []);
    const [selectedCustomer, setSelectedCustomer] = useLocalStorage<CustomerWithNameAndPhone | null>('selectedCustomer', null);
    const [isLoadingRedirect, setIsLoadingRedirect] = useState<boolean>(false);
    const [totalDiscount, setTotalDiscount] = useLocalStorage<number>('totalDiscount', 0);
    const [zpAppTransId, setZpAppTransId] = useLocalStorage<string | null>('zpAppTransId', null);
    const [order, setOrder] = useLocalStorage<OrderResponseCreated | null>('order', null);

    const state: SaleSate = {
        selectedMovie,
        selectedShowTime,
        selectedSeats,
        selectedTempSeats,
        selectedProducts,
        selectedProductGifts,
        selectedCustomer,

        totalDiscount,
        order,
        isLoadingRedirect,
        zpAppTransId,
    };

    // Mutations
    const createOrder = useCreateOrderByEmployee();
    const updateSeat = useUpdateSeatInOrderByEmployee();
    const updateProductInOrder = useUpdateProductInOrderByEmployee();
    const updateCustomerInOrder = useUpdateCustomerInOrderByEmployee();
    const cancelOrder = useCancelOrderByEmployee();

    const syncProductsWithOrder = useCallback(async () => {
        console.log('order:', order);
        if (!order) {
            setSelectedProducts([]);
            setSelectedProductGifts([]);
            return;
        }
        const regularProducts: SelectedProduct[] = [];
        const giftProducts: SelectedProduct[] = [];

        order.orderDetails.forEach(detail => {
            const selectedProduct = convertOrderDetailToSelectedProduct(detail);
            console.log('selectedProduct:', selectedProduct);
            if (selectedProduct) {
                if (detail.isGift) {
                    giftProducts.push(selectedProduct);
                } else {
                    regularProducts.push(selectedProduct);
                }
            }
        });

        setSelectedProducts(regularProducts);
        setSelectedProductGifts(giftProducts);
    }, [order]);

    useEffect(() => {
        console.log('order:', order);
        syncProductsWithOrder();
    }, [order, syncProductsWithOrder]);

    // Flow Navigation Logic
    const validFlowRoutes = useMemo(() => [
        '/admin/sales/choose-seat',
        '/admin/sales/choose-combo',
        '/admin/sales/payment',
    ], []);

    const isValidFlowRoute = useCallback((path: string) => {
        return validFlowRoutes.includes(path);
    }, [validFlowRoutes]);

    const handleLeaveFlow = useCallback(async () => {
        if (hasLeftFlow) return;

        if (order) {
            await cancelOrder.mutateAsync(order.id);
        }

        setSelectedMovie(null);
        setSelectedShowTime(null);
        setSelectedSeats([]);
        setSelectedTempSeats([]);
        setSelectedProducts([]);
        setSelectedCustomer(null);
        setOrder(null);
        setTotalDiscount(0);
        setIsLoadingRedirect(false);

        setHasLeftFlow(true);
    }, [hasLeftFlow, order, cancelOrder]);

    useEffect(() => {
        if (!pathname) return;

        if (!isValidFlowRoute(pathname)) {
            handleLeaveFlow();
        } else {
            setHasLeftFlow(false);
        }
    }, [pathname, isValidFlowRoute, handleLeaveFlow]);

    const updateMovieAndShowTime = useCallback((
        newMovie: AdminMovie | null,
        newShowTime: AdminShowTimeForSale | null,
    ) => {
        setSelectedMovie(newMovie);
        setSelectedShowTime(newShowTime);

        setSelectedSeats([]);
        setSelectedTempSeats([]);
        setSelectedProducts([]);

        setOrder(null);
    }, []);

    const navigationActions = {
        proceedToPaymentSelection: useCallback(async () => {
            if (selectedMovie && selectedShowTime && selectedSeats.length > 0 && order) {
                setIsLoadingRedirect(true);
                const { data } = await updateProductInOrder.mutateAsync({
                    orderId: order.id,
                    data: {
                        products: selectedProducts.map(product => ({
                            id: product.product.id,
                            quantity: product.quantity,
                        })),
                    },
                });

                if (data) {
                    setTotalDiscount(data.totalDiscount);
                    setOrder(data);
                }
                setIsLoadingRedirect(false);
                router.push('/admin/sales/payment');
            }
        }, [selectedMovie, selectedShowTime, selectedSeats.length, order, updateProductInOrder, selectedProducts, router]),

        proceedToComboSelection: useCallback(async () => {
            if (selectedMovie && selectedShowTime && selectedSeats.length > 0) {
                setIsLoadingRedirect(true);
                if (order) {
                    const { data } = await updateSeat.mutateAsync({
                        orderId: order.id,
                        data: {
                            seatIds: selectedSeats.map(seat => seat.id),
                        },
                    });
                    if (data) {
                        setTotalDiscount(data.totalDiscount);
                        setOrder(data);
                    }
                } else {
                    const { data } = await createOrder.mutateAsync({
                        customerId: selectedCustomer?.id,
                        showTimeId: selectedShowTime.id,
                        seatIds: selectedSeats.map(seat => seat.id),
                    });
                    if (data) {
                        setTotalDiscount(data.totalDiscount);
                        setOrder(data);
                    }
                }
                setIsLoadingRedirect(false);
                setSelectedTempSeats(selectedSeats);
                router.push('/admin/sales/choose-combo');
            }
        }, [selectedMovie, selectedShowTime, selectedSeats, order, router, updateSeat, createOrder, selectedCustomer?.id]),

        proceedToSeatSelection: useCallback(() => {
            if (selectedMovie && selectedShowTime) {
                router.push('/admin/sales/choose-seat');
            }
        }, [selectedMovie, selectedShowTime, router]),
    };

    const updateOrder = (order: OrderResponseCreated | null) => {
        setOrder(order);
    };

    const updateZpAppTransId = (zpAppTransId: string | null) => {
        setZpAppTransId(zpAppTransId);
    };

    const handleOrderExpired = useCallback(async () => {
        if (order) {
            try {
                await cancelOrder.mutateAsync(order.id);
                // Clear tất cả state
                setSelectedMovie(null);
                setSelectedShowTime(null);
                setSelectedSeats([]);
                setSelectedProducts([]);
                setSelectedCustomer(null);
                setOrder(null);
                setTotalDiscount(0);
                setIsLoadingRedirect(false);

                // Redirect về trang chọn phim
                router.push('/admin/sales');
            } catch (error) {
                console.error('Failed to cancel expired order:', error);
            }
        }
    }, [order, cancelOrder, router]);

    const seatActions = {
        addSeat: useCallback((seat: Seat) => {
            setSelectedSeats(prev => {
                console.log('prev:', prev);
                if (prev.some(s => s.id === seat.id)) {
                    return prev;
                }
                console.log('seat, prev:', seat, prev);
                return [...prev, seat];
            });
        }, []),

        removeSeat: useCallback((seatId: number) => {
            setSelectedSeats(prev => prev.filter(seat => seat.id !== seatId));
        }, []),
    };

    const productActions = {
        addProduct: useCallback((product: BaseProductWithPrice) => {
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
        }, []),

        updateProductQuantity: useCallback((productId: number, quantity: number) => {
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
        }, []),
    };

    const customerActions = {
        updateCustomer: useCallback(async (newCustomer: CustomerWithNameAndPhone | null) => {
            if (order) {
                await updateCustomerInOrder.mutateAsync({
                    orderId: order.id,
                    data: {
                        customerId: newCustomer?.id,
                    },
                });
            }
            setSelectedCustomer(newCustomer);
        }, [order, updateCustomerInOrder]),

        clearCustomer: useCallback(() => {
            setSelectedCustomer(null);
        }, [setSelectedCustomer]),

        handleClearCustomer: async () => {
            if (order) {
                await updateCustomerInOrder.mutateAsync({
                    orderId: order.id,
                    data: {
                        customerId: undefined,
                    },
                });
            }
            setSelectedCustomer(null);
        },
    };

    // Combine all actions
    const actions: SaleActions = {
        ...customerActions,
        ...productActions,
        ...seatActions,
        updateMovieAndShowTime,
        ...navigationActions,
        updateOrder,
        updateZpAppTransId,
        handleOrderExpired,
    };

    return (
        <SaleContext.Provider value={{ ...state, ...actions }}>
            {children}
        </SaleContext.Provider>
    );
};

export default SaleProvider;
export { SaleContext };