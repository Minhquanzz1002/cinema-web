import React from 'react';
import { InputMask } from '@react-input/mask';

const DateInput = () => {
    return (
        <InputMask mask="DD/MM/YYYY"
                   replacement={{ d: /[0-3]/, m: /[0-1]/, y: /[0-9]/ }}
                   placeholder="DD/MM/YYYY"
                   separate

        />
    );
};

export default DateInput;