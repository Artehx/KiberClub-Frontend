import { useClienteLoggedContext } from '../../../context-providers/ClienteLoggedContext';
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import pedidoRESTService from "../../../services/restPedido";
import MiniTicket from "./MiniTicket";
import { toast } from 'react-toastify';
import Confetti from "react-confetti";
import useWindowSize from 'react-use/lib/useWindowSize'
import indexedDBService from "../../../services/indexedDB";
import ModalShare from './ModalShare';

function MisTickets() {
    const { clienteLogged, dispatch } = useClienteLoggedContext();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const [clienteId, setClienteId] = useState(null);
    const [paymentId, setPaymentId] = useState(null);
    const [descuentoId, setDescuentoId] = useState(null);
    const [pdfBlob, setPdfBlob] = useState(null);
    const [confetiActivado, setConfetiActivado] = useState(false);
    const { width, height } = useWindowSize();
    const [modal, setModal] = useState(false);
    const [ordenId, setOrdenId] = useState(null);
    const [eventos, setEventos] = useState([]);
    const [peticionEnviada, setPeticionEnviada] = useState(false);

    // Extraer parámetros de la URL
    useEffect(() => {
        const clienteIdFromUrl = searchParams.get('clienteId');
        const paymentIdFromUrl = searchParams.get('payment_intent_client_secret');
        const descuentoIdFromUrl = searchParams.get('descuentoId');

        if (clienteIdFromUrl && paymentIdFromUrl) {
            setClienteId(clienteIdFromUrl);
            setPaymentId(paymentIdFromUrl);
            setDescuentoId(descuentoIdFromUrl);
        }
    }, [searchParams]);

    // Recuperar el PDF desde IndexedDB
    useEffect(() => {
        async function getPdfBlob() {
            if (paymentId) {
                indexedDBService.recuperarPDF(paymentId, (pdfRecuperado) => {
                    setPdfBlob(pdfRecuperado);
                });
            }
        }

        getPdfBlob();
    }, [paymentId]);

    // Enviar petición de finalización de pago
    useEffect(() => {
        async function finishPayment() {
            if (clienteId && paymentId && pdfBlob && !peticionEnviada) {
                try {
                    let _resp = await pedidoRESTService.forzarSesionConPago(clienteId, paymentId, descuentoId, pdfBlob);

                    if (_resp.codigo === 0) {
                        dispatch({
                            type: 'CLIENTE_LOGGED',
                            payload: { datoscliente: _resp.datoscliente, jwt: _resp.tokensesion }
                        });
                        setConfetiActivado(true);
                        toast.success('¡Gracias por comprar!');
                        toast.info('Comprueba la ruleta ¡Tienes una nueva ficha!');
                        if (descuentoId !== '0') {
                            toast.info('Has gastado uno de tus descuentos..');
                        }
                        setPeticionEnviada(true);
                    }
                } catch (error) {
                    console.log('Error total...', error);
                }
            }
        }

        finishPayment();
    }, [clienteId, paymentId, pdfBlob, descuentoId, peticionEnviada, dispatch]);

    const handleGetPdf = async (paymentId) => {
        try {
            const pdfBlob = await pedidoRESTService.recuperarPDF(paymentId);
            if (pdfBlob) {
                const url = window.URL.createObjectURL(pdfBlob);
                const enlace = document.createElement('a');
                enlace.href = url;
                enlace.download = `pdf_${paymentId}.pdf`;
                document.body.appendChild(enlace);
                enlace.click();
                enlace.remove();
                window.URL.revokeObjectURL(url);
            }
        } catch (error) {
            console.error('Error al descargar el PDF:', error);
        }
    };

    const handleShareOrden = async (ordenId) => {
        setOrdenId(ordenId);
        setModal(true);
    };

    const handleCerrarModalEvento = () => {
        setModal(false);
    };

    const handleSendId = async (usuarioId) => {
        let _resp = await pedidoRESTService.compartirOrden(ordenId, usuarioId);

        if (_resp.codigo === 0) {
            toast.success(_resp.mensaje);
            setModal(false);
        } else {
            toast.error("Algo salió mal, intentalo más tarde...");
        }
    };

    return (
        <>
            {confetiActivado && <Confetti width={width} height={height} recycle={false} />}
            {clienteLogged && (
                <>
                    <div className="flex flex-col items-center justify-center pt-28 pb-8 mt-2 background-gray border-b-2 border-gray-700">
                        <h1 className="text-4xl silkScreen">
                            <span className="text-red-600">Aqui</span> tendras tus <span className="text-green-700">tickets</span> <span className="text-yellow-700">disponibles</span>
                        </h1>
                        <span className="text-base silkScreen mb-4">Recuerda descargar el pdf antes del concierto 🎟️🎟️</span>
                    </div>
                    {clienteLogged.datoscliente.ordenes.length > 0 ? (
                        <div className="grid grid-cols-4 gap-4 w-full px-2 py-2.5">
                            {clienteLogged.datoscliente.ordenes.map((event) => (
                                <MiniTicket key={event._id} evento={event} onSendId={handleGetPdf} onShare={handleShareOrden} />
                            ))}
                            <ModalShare open={modal} onClose={handleCerrarModalEvento} sendId={handleSendId} />
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-80">
                            <span className="text-4xl balsamiq-sans-regular">Sin órdenes aún. ¡Aprovecha y compra ahora!</span>
                        </div>
                    )}
                </>
            )}
        </>
    );
}

export default MisTickets;