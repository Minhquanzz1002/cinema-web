import { useEffect, useRef, useState } from 'react';

function useLocalStorage<T>(key: string, initialValue: T) {
    const  isFirstRender = useRef(true);

    const [storedValue, setStoredValue] = useState<T>(() => {
        if (typeof window === 'undefined') {
            console.log('key:', key);
            console.log('initialValue:', initialValue);
            console.log('is server');
            return initialValue;
        }

        try {
            console.log('key:', key);
            console.log('initialValue:', initialValue);
            console.log('is client');
            const item = window.localStorage.getItem(key);
            console.log('item:', item);
            if (!item && isFirstRender.current) {
                return initialValue;
            }

            const parsedItem = item ? JSON.parse(item) : initialValue;

            if (Array.isArray(initialValue)) {
                return Array.isArray(parsedItem) ? parsedItem : [];
            }

            return parsedItem;
        } catch (error) {
            console.warn(`Error reading localStorage key “${key}”:`, error);
            return initialValue;
        } finally {
            isFirstRender.current = false;
        }
    });

    const setValue = (value: T | ((val: T) => T)) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);

            console.log('valueToStore:', valueToStore);

            if (typeof window !== 'undefined') {
                if (valueToStore === null || (Array.isArray(valueToStore) && valueToStore.length === 0)) {
                    window.localStorage.removeItem(key);
                } else {
                    window.localStorage.setItem(key, JSON.stringify(valueToStore));
                }
            }
        } catch (error) {
            console.warn(`Error setting localStorage key “${key}”:`, error);
        }
    };

    useEffect(() => {
        return () => {
            if (Array.isArray(initialValue)) {
                window.localStorage.removeItem(key);
            }
        };
    }, [key, initialValue]);

    return [storedValue, setValue] as const;
}

export default useLocalStorage;