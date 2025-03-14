import React, { useEffect } from "react";
import { IoIosCheckmarkCircle, IoIosCloseCircle, IoIosWarning } from "react-icons/io";

/**
 * Componente di allerta per la visualizzazione di messaggi di errore, avviso o successo.
 * 
 * @component
 * @param {string} Type - Il tipo di allerta ('error', 'warning', 'success').
 * @param {string} Title - Il titolo dell'allerta.
 * @param {string} Description - La descrizione dell'allerta.
 * @param {function} onClose - La funzione per chiudere l'allerta.
 * @param {boolean} Modal - Se `true`, visualizza l'allerta in un modal.
 * @param {string} Image - Base64 o URL dell'immagine da visualizzare nell'allerta.
 * @returns {React.Element} Il componente dell'allerta.
 */
function Alert({ Type, Title, Description, onClose, Modal, Image }) {
    // Aggiungiamo un listener per il tasto Esc
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        // Pulizia: rimuoviamo il listener quando il componente viene smontato
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [onClose]);

    const alertContent = (
        <div
            className={`Alert_MainDiv ${
                Type === "error"
                    ? "Alert_Error"
                    : Type === "warning"
                    ? "Alert_Warning"
                    : Type === "success"
                    ? "Alert_Success"
                    : ""
            }`}
        >
            <button onClick={onClose} className="Alert_MainDiv_Btn">
                X
            </button>
            <div className="Alert_MainDiv_Icon">
                {Type === "error" ? (
                    <IoIosCloseCircle />
                ) : Type === "warning" ? (
                    <IoIosWarning />
                ) : Type === "success" ? (
                    <IoIosCheckmarkCircle />
                ) : (
                    ""
                )}
            </div>
            <div className="Alert_MainDiv_Title">{Title}</div>
            <div className="Alert_MainDiv_Description">
                {Description.split("\n").map((line, index) => (
                    <span key={index}>
                        {line}
                        <br />
                    </span>
                ))}
            </div>
            {Image && (
                <div className="Alert_MainDiv_Image">
                    <img src={Image} alt="Alert visual" />
                </div>
            )}
        </div>
    );

    return Modal ? (
        <div className="confirm_modal_overlay zindex1000">
            {alertContent}
        </div>
    ) : (
        alertContent
    );
}

export default Alert;
