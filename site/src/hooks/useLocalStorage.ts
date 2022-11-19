import {useState, useEffect, useCallback} from "react";

export const useLocalStorage = <T>(keyName:string, defaultValue:T) => {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const value = window.localStorage.getItem(keyName);
            if (value) {
                return JSON.parse(value);
            } else {
                window.localStorage.setItem(keyName, JSON.stringify(defaultValue));
                return defaultValue;
            }
        } catch (err) {
            return defaultValue;
        }
    });


    useEffect(() => {
        try {
            window.localStorage.setItem(keyName, JSON.stringify(storedValue));
        } catch (err) {}
    },[storedValue])

    return [storedValue, setStoredValue];
};

/*function useLocalStorage(key:string, initialValue:any, isObject:boolean = true ) {
    const router = useRouter();
    const [value, setValue] = useState(initialValue);

    useEffect(() => {
        const objectValue = JSON.parse(localStorage.getItem(key))
        console.log('object',objectValue)
        if(objectValue){
            console.log('is object',isObject)
            if(isObject){
                console.log('set Object',{...value, ...objectValue})
                setValue(value => ({...value, ...objectValue}));
            }else{
                console.log('set string',objectValue)
                setValue(objectValue)
            }
        }
    },[])

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(value));
    }, [value,router.isReady])

    const onSetValue = useCallback(
        newValue => {
            setValue(newValue);
        },
        [key]
    );

    return [value, onSetValue];
}*/

export default useLocalStorage;