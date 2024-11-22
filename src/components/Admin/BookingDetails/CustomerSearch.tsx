import React, { useRef, useState } from 'react';
import { Form, Formik } from 'formik';
import Input from '@/components/Admin/Input';
import AutoSubmitForm from '@/components/Admin/AutoSubmitForm';
import { useAllCustomerWithPhone } from '@/modules/customers/repository';
import { useSaleContext } from '@/context/SaleContext';
import useClickOutside from '@/hook/useClickOutside';
import { FaRegUser } from 'react-icons/fa';

interface FormValues {
    phone: string;
}

const CustomerSearch = () => {
    const [phone, setPhone] = useState('');
    const { data: customers } = useAllCustomerWithPhone(phone);
    const { setCustomer } = useSaleContext();
    const dropdownRef = useRef<HTMLDivElement>(null);

    useClickOutside(dropdownRef, () => setPhone(''));

    const onSubmit = (values: FormValues) => {
        setPhone(values.phone);
    };

    return (
        <Formik initialValues={{ phone }} onSubmit={onSubmit} enableReinitialize>
            <Form>
                <div className="flex gap-3 items-center">
                    <label className="mb-3" htmlFor="customer">Khách hàng:</label>
                    <div className="flex-1 relative">
                        <Input name="phone" id="customer" placeholder="Nhập số điện thoại" />
                        {
                            phone && (
                                <div
                                    ref={dropdownRef}
                                    className="absolute top-full -mt-2 bg-white rounded shadow-lg border left-0 right-0 z-10"
                                >
                                    {
                                        customers && customers.length > 0 ? (
                                            customers.map((customer, index: number) => (
                                                <button
                                                    type="button" key={customer.id}
                                                    className={`py-2 px-3 block font-normal hover:bg-gray-100 w-full text-left ${index > 0 && 'border-t border-dashed border-black/30'}`}
                                                    onClick={() => {
                                                        setCustomer(customer);
                                                        setPhone('');
                                                    }}
                                                >
                                                    <div className="flex gap-2">
                                                        <div className="flex justify-center items-center w-8">
                                                            <FaRegUser size={20} />
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <div className="font-medium">{customer.name}</div>
                                                            <div className="text-xs">{customer.phone}</div>
                                                        </div>
                                                    </div>
                                                </button>
                                            ))
                                        ) : (
                                            <div className="py-2 px-3">Không tìm thấy</div>
                                        )
                                    }
                                </div>
                            )
                        }
                    </div>
                </div>
                <AutoSubmitForm />
            </Form>
        </Formik>
    );
};

export default CustomerSearch;