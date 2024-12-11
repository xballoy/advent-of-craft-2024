type Eid = string & { readonly __brand: unique symbol };

const isValidSerial = (serial: string | undefined): boolean => {
    if(!serial) {
        return false;
    }
    return Number.parseInt(serial) > 0;
}

const isValidKey = (value: string | undefined, key: string | undefined): boolean => {
    if(!value || !key) {
        return false;
    }
    return (97 - Number.parseInt(value) % 97) === Number.parseInt(key);
}

export const isEid = (value: string | null | undefined): value is Eid  => {
    const EID_REGEX = /(?<gender>[123])(?<birthYear>[0-9]{2})(?<serial>[0-9]{3})(?<key>[0-9]{2})/;
    const matched = (value ?? '').match(EID_REGEX);
    return !!matched?.groups &&
        isValidSerial(matched.groups['serial']) &&
        isValidKey(`${matched.groups['gender']}${matched.groups['birthYear']}${matched.groups['serial']}`, matched.groups['key']);
}
