import React from "react";

const useExamConfig = (key: string) => {
    const config = React.useMemo(() => {
        switch (key) {
            default:
                return null
        }
    }, [key]);
    return config;
};
export {useExamConfig}