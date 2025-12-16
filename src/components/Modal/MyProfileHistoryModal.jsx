import { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AppContext } from "../../AppContext";
import { callApi } from "../../utils/Utils";
import LoadApi from "../../components/Loading/LoadApi";

const MyProfileHistoryModal = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { contextData } = useContext(AppContext);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkIsMobile = () => {
            return window.innerWidth <= 767;
        };

        setIsMobile(checkIsMobile());

        const handleResize = () => {
            setIsMobile(checkIsMobile());
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const getDefaultDates = () => {
        const now = new Date();
        const currentMonthFirst = new Date(now.getFullYear(), now.getMonth(), 1);
        const nextMonthFirst = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        return { dateFrom: currentMonthFirst, dateTo: nextMonthFirst };
    };

    const [filters, setFilters] = useState(getDefaultDates());
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeType, setActiveType] = useState('history');
    const [pagination, setPagination] = useState({
        start: 0,
        length: 10,
        totalRecords: 0,
        currentPage: 1,
    });

    const handleDateChange = (date, name) => {
        setFilters((prev) => ({ ...prev, [name]: date }));
    };

    const handlePageChange = (page) => {
        setPagination((prev) => ({
            ...prev,
            start: (page - 1) * prev.length,
            currentPage: page,
        }));
    };

    const fetchHistory = (type) => {
        setLoading(true);

        const formatDateForAPI = (date) => {
            if (!date) return '';
            const d = new Date(date);
            return d.toISOString().split('T')[0];
        };

        let queryParams;
        let apiEndpoint;

        if (type === 'history') {
            queryParams = new URLSearchParams({
                start: pagination.start,
                length: pagination.length,
                ...(filters.dateFrom && { date_from: formatDateForAPI(filters.dateFrom) }),
                ...(filters.dateTo && { date_to: formatDateForAPI(filters.dateTo) }),
                type: "slot"
            }).toString();
            apiEndpoint = `/get-history?${queryParams}`;
        } else {
            queryParams = new URLSearchParams({
                start: pagination.start,
                length: pagination.length,
                ...(filters.dateFrom && { date_from: formatDateForAPI(filters.dateFrom) }),
                ...(filters.dateTo && { date_to: formatDateForAPI(filters.dateTo) }),
            }).toString();
            apiEndpoint = `/get-transactions?${queryParams}`;
        }

        callApi(
            contextData,
            "GET",
            apiEndpoint,
            (response) => {
                if (response.status === "0") {
                    setTransactions(response.data);
                    setPagination((prev) => ({
                        ...prev,
                        totalRecords: response.recordsTotal || 0,
                    }));
                } else {
                    setTransactions([]);
                    console.error("API error:", response);
                }
                setLoading(false);
            },
            null
        );
    };

    const handleSubmit = (e) => {
        if (e && e.preventDefault) {
            e.preventDefault();
        }
        setPagination((prev) => ({ ...prev, start: 0, currentPage: 1 }));
        fetchHistory(activeType);
    };

    useEffect(() => {
        if (!contextData?.session) {
            navigate("/");
        }
    }, [contextData?.session, navigate]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    useEffect(() => {
        fetchHistory(activeType);
    }, [pagination.start, pagination.length, activeType]);

    const handleTypeChange = (type) => {
        setActiveType(type);
        setPagination((prev) => ({ ...prev, start: 0, currentPage: 1 }));
    };

    const formatDateDisplay = (dateString) => {
        const date = new Date(dateString);
        const pad = (n) => String(n).padStart(2, '0');
        const year = date.getFullYear();
        const month = pad(date.getMonth() + 1);
        const day = pad(date.getDate());
        const hours = pad(date.getHours());
        const minutes = pad(date.getMinutes());
        const seconds = pad(date.getSeconds());

        return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
    };

    const formatBalance = (value) => {
        const num = parseFloat(value);
        return num.toLocaleString('de-DE', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    const formatOperation = (operation) => {
        return operation === "change_balance" ? "change balance" : operation;
    };

    const totalPages = Math.ceil(pagination.totalRecords / pagination.length);

    const getVisiblePages = () => {
        const delta = 1;
        const visiblePages = [];
        let startPage = Math.max(1, pagination.currentPage - delta);
        let endPage = Math.min(totalPages, pagination.currentPage + delta);

        if (endPage - startPage + 1 < 2 * delta + 1) {
            if (startPage === 1) {
                endPage = Math.min(totalPages, startPage + 2 * delta);
            } else {
                startPage = Math.max(1, endPage - 2 * delta);
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            visiblePages.push(i);
        }

        return { visiblePages, startPage, endPage };
    };

    const { visiblePages } = getVisiblePages();

    const handleFirstPage = () => handlePageChange(1);
    const handlePrevPage = () => handlePageChange(pagination.currentPage - 1);
    const handleNextPage = () => handlePageChange(pagination.currentPage + 1);
    const handleLastPage = () => handlePageChange(totalPages);

    return (
        <div
            id="myAccountZeus"
            data-bs-backdrop="true"
            className="modal fade show"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)', display: 'block' }}
            aria-modal="true"
            role="dialog"
        >
            <div className="modal-dialog modal-fullscreen">
                <div
                    className="modal-content"
                    style={{ backgroundColor: '#242834', fontFamily: '"Exo 2", sans-serif' }}
                >
                    <div className="modal-body p-4" >
                        <div className="container">
                            <h3 style={{ color: "white" }}><span className="fa fa-table mb-3"></span> Historial de cuenta</h3>

                            <div className="row">
                                <div className="col-md-2 col-sm-12 mb-2">
                                    <input
                                        type="date"
                                        className="input-custom"
                                        value={filters.dateFrom.toISOString().split('T')[0]}
                                        onChange={(e) => handleDateChange(new Date(e.target.value), 'dateFrom')}
                                    />
                                </div>
                                <div className="col-md-2 col-sm-12 mb-2">
                                    <input
                                        type="date"
                                        className="input-custom"
                                        value={filters.dateTo.toISOString().split('T')[0]}
                                        onChange={(e) => handleDateChange(new Date(e.target.value), 'dateTo')}
                                    />
                                </div>
                                <div className="col-md-2 col-sm-12 mb-2">
                                    <select
                                        className="input-custom"
                                        value={activeType}
                                        onChange={(e) => handleTypeChange(e.target.value)}
                                    >
                                        <option value="history">Últimas jugadas</option>
                                        <option value="transaction">Depósitos/Retiros</option>
                                    </select>
                                </div>
                                <div className="col-md-2 col-sm-12 mb-2">
                                    <button
                                        className="btn w-100"
                                        style={{ fontSize: "small", fontWeight: "bold", textTransform: "uppercase", backgroundColor: "#c78849", color: "black" }}
                                        onClick={handleSubmit}
                                    >
                                        Buscar
                                    </button>
                                </div>
                                <div style={{ color: "white" }}>
                                    <span>La plataforma solo almacena movimientos de casino hasta por 7 días.</span>
                                </div>
                            </div>

                            {loading && <div className="py-3"><LoadApi /></div>}

                            {!loading && (
                                <>
                                    {transactions.length > 0 ? (
                                        <div className="table-responsive my-3">
                                            <table className="table" style={{ color: "white", fontSize: "15px" }}>
                                                <thead style={{ color: "#c78849" }}>
                                                    <tr>
                                                        <th scope="col">Fecha</th>
                                                        <th scope="col">Operación</th>
                                                        <th scope="col">Monto</th>
                                                        <th scope="col">Balance Previo</th>
                                                        <th scope="col">Balance Posterior</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {transactions.map((txn, index) => (
                                                        <tr key={index}>
                                                            <td>{formatDateDisplay(txn.created_at)}</td>
                                                            <td className="text-uppercase">{activeType === "history" ? formatOperation(txn.operation) : txn.type || "-"}</td>
                                                            <td>{formatBalance(txn.value || txn.amount || 0)}</td>
                                                            <td>{formatBalance(activeType === "history" ? txn.value_before : txn.to_current_balance || 0)}</td>
                                                            <td>{formatBalance(activeType === "history" ? txn.value_after : txn.to_new_balance || 0)}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <div style={{ color: "white", textAlign: "center", padding: "20px" }}>
                                            <span>No hay transacciones</span>
                                        </div>
                                    )}

                                    {totalPages > 1 && (
                                        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "20px" }}>
                                            <nav>
                                                <ul className="pagination" style={{ margin: 0 }}>
                                                    {pagination.currentPage > 1 && (
                                                        <>
                                                            {!isMobile && (
                                                                <li className="page-item">
                                                                    <button
                                                                        className="page-link"
                                                                        onClick={handleFirstPage}
                                                                    >
                                                                        &lt;&lt;
                                                                    </button>
                                                                </li>
                                                            )}
                                                            <li className="page-item">
                                                                <button
                                                                    className="page-link"
                                                                    onClick={handlePrevPage}
                                                                >
                                                                    &lt;
                                                                </button>
                                                            </li>
                                                        </>
                                                    )}

                                                    {visiblePages.map((page) => (
                                                        <li
                                                            key={page}
                                                            className={`page-item ${pagination.currentPage === page ? "active" : ""}`}
                                                        >
                                                            <button
                                                                className="page-link"
                                                                onClick={() => handlePageChange(page)}
                                                            >
                                                                {page}
                                                            </button>
                                                        </li>
                                                    ))}

                                                    {pagination.currentPage < totalPages && (
                                                        <>
                                                            <li className="page-item">
                                                                <button
                                                                    className="page-link"
                                                                    onClick={handleNextPage}
                                                                >
                                                                    &gt;
                                                                </button>
                                                            </li>
                                                            {!isMobile && (
                                                                <li className="page-item">
                                                                    <button
                                                                        className="page-link"
                                                                        onClick={handleLastPage}
                                                                    >
                                                                        &gt;&gt;
                                                                    </button>
                                                                </li>
                                                            )}
                                                        </>
                                                    )}
                                                </ul>
                                            </nav>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                        <div className="text-center pb-3">
                            <button
                                className="btn"
                                style={{
                                    fontSize: "small",
                                    fontWeight: "bold",
                                    textTransform: "uppercase",
                                    backgroundColor: "#c78849",
                                    color: "black",
                                }}
                                onClick={() => onClose()}
                            >
                                Cerrar
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyProfileHistoryModal;