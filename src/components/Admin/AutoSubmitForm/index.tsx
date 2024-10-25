import useDebounce from '@/hook/useDebounce';
import { useFormikContext } from 'formik';
import { useEffect } from 'react';

const AutoSubmitForm = () => {
    const { values, submitForm } = useFormikContext();

    // Debounce values
    const debouncedValues = useDebounce(values, 300);

    useEffect(() => {
        submitForm();
    }, [debouncedValues, submitForm]);

    return null;
};

export default AutoSubmitForm;