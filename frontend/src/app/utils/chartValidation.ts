import { ValidationData } from "../interfaces/validate.data";

function checkStringFormat(rawValue : string) {
    rawValue = rawValue.replace(',', '.');
    const regex = /^-?\d*\.?\d*$/;

    return regex.test(rawValue);
}



function checkForNull(value : string) {
    return !(value === '' || value === null || value === undefined);
}


function validateInput(variableName : string, value : string, min : number, max : number, decimalPlaces = 3): ValidationData {
    if (!checkForNull(value)) {
        return {
            isValid: false,
            message: `Значение ${variableName} не может быть пустым`,
            parsedValue: 0
        } as ValidationData;
    }

    if (!checkStringFormat(value)) {
        return {
            isValid: false,
            message: `Значение ${variableName} должно быть числом`,
            parsedValue: 0
        } as ValidationData;
    }

    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
        return {
            isValid: false,
            message: `Неверный формат числа для значения ${variableName}`,
            parsedValue: 0
        } as ValidationData;
    }

    const parts = value.split('.');
    if (parts.length > 1 && parts[1].length > decimalPlaces) {
        return {
            isValid: false,
            message: `Слишком много знаков после запятой для ${variableName}. Максимум: ${decimalPlaces}`,
            parsedValue: 0
        } as ValidationData;
    }

    if (numValue < min || numValue > max) {
        return {
            isValid: false,
            message: `Значение ${variableName} должно быть от ${min} до ${max}. Текущее значение: ${numValue}`,
            parsedValue: 0
        }  as ValidationData; 
    }

    return {
        isValid: true,
        message: 'OK',
        parsedValue: numValue
    } as ValidationData;
}


export function checkX(xRawValue : string) {
    return validateInput('X', xRawValue, -3, 5);
}

export function checkY(yRawValue : string) {
    return validateInput('Y', yRawValue, -5, 5);
}

export function checkR(rRawValue : string) {
    return validateInput('R', rRawValue, 1, 5);
}