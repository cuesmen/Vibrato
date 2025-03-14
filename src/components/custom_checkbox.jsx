import React, { useId } from "react";

export default function CustomCheckbox({ Title, CColor, checked, onChange, MarginBottom }) {
    const id = useId(); 

    const handleCheckboxChange = (event) => {
        const isChecked = event.target.checked;
        if (onChange) {
            onChange(isChecked); 
        }
    };

    return (
        <>
            <div className="checkbox-wrapper-46" style={{marginBottom : MarginBottom}}>
                <input
                    type="checkbox"
                    id={`cbx-${id}`}
                    className="inp-cbx"
                    checked={checked}
                    onChange={handleCheckboxChange}
                />
                <label htmlFor={`cbx-${id}`} className="cbx">
                    <span>
                        <svg viewBox="0 0 12 10" height="10px" width="12px">
                            <polyline points="1.5 6 4.5 9 10.5 1" />
                        </svg>
                    </span>
                    <span style={{ color: CColor }}>{Title}</span>
                </label>
            </div>
        </>
    );
}
