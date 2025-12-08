import { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation, useOutletContext } from "react-router-dom";
import { AppContext } from "../../AppContext";
import { callApi } from "../../utils/Utils";
import AuthHeader from "../../components/Auth/AuthHeader";
import LoadApi from "../../components/Loading/LoadApi";
import IconChevronLeft from "/src/assets/svg/chevron-left.svg";
import IconChevronRight from "/src/assets/svg/chevron-right.svg";
import IconDoubleLeft from "/src/assets/svg/double-arrow-left.svg";
import IconDoubleRight from "/src/assets/svg/double-arrow-right.svg";
import ImgNoResult from "/src/assets/img/no-transaction.png";

const ProfileHistory = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { contextData } = useContext(AppContext);
    const { isMobile } = useOutletContext();

    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        start: 0,
        length: 5,
        totalRecords: 0,
        currentPage: 1,
    });

    const handlePageChange = (page) => {
        setPagination((prev) => ({
            ...prev,
            start: (page - 1) * prev.length,
            currentPage: page,
        }));
    };

    const fetchHistory = () => {
        setLoading(true);

        let queryParams = new URLSearchParams({
            start: pagination.start,
            length: pagination.length
        }).toString();
        let apiEndpoint = `/get-transactions?${queryParams}`;

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

    useEffect(() => {
        if (!contextData?.session) {
            navigate("/");
        }
    }, [contextData?.session, navigate]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    useEffect(() => {
        fetchHistory();
    }, [pagination.start, pagination.length]);

    const formatDateDisplay = (dateString) => {
        const date = new Date(dateString);

        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear().toString().slice(-2);

        return `${day}.${month}.${year}, ${hours}:${minutes}`;
    };

    const formatBalance = (value) => {
        const num = parseFloat(value);
        return num.toLocaleString('de-DE', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
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
        <div className="personal-profile-container">
            <AuthHeader title="Transacciones" link="/profile" />

            {loading ? (
                <div className="transaction-container">
                    <LoadApi />
                </div>
            ) : transactions.length > 0 ? (
                <div className="transaction-container">
                    {transactions.map((txn, index) => (
                        <div className="transaction-content" key={index}>
                            <div className="transaction-icon">
                                <i className="material-icons">south_west</i>
                            </div>
                            <div className="transaction-text">
                                <div className="transaction-date">{formatDateDisplay(txn.created_at)}</div>
                                <span>Receipt of payment No. {txn.id} processed, payment amount: {formatBalance(txn.amount)} $</span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="no-results">
                    <img src={ImgNoResult} alt="No results found" />
                    <div className="mt-5">No hay transacciones</div>
                </div>
            )}

            {totalPages > 1 && (
                <div className="transaction-table">
                    <div className="transaction-table__status-pagination">
                        <div className="transaction-table__paginate">
                            {pagination.currentPage > 1 && (
                                <>
                                    {
                                        !isMobile && <button className="transaction-table-paginate--btn" onClick={handleFirstPage}>
                                            <img src={IconDoubleLeft} alt="first" width={16} />
                                        </button>
                                    }
                                    <button className="transaction-table-paginate--btn" onClick={handlePrevPage}>
                                        <img src={IconChevronLeft} alt="next" width={20} style={{ filter: "invert(1)" }} />
                                    </button>
                                </>
                            )}

                            {visiblePages.map((page) => (
                                <span
                                    key={page}
                                    className="transaction-table-paginate--btn"
                                    onClick={() => handlePageChange(page)}
                                >
                                    {page}
                                </span>
                            ))}

                            {pagination.currentPage < totalPages && (
                                <>
                                    <button className="transaction-table-paginate--btn" onClick={handleNextPage}>
                                        <img src={IconChevronRight} alt="first" width={20} style={{ filter: "invert(1)" }} />
                                    </button>
                                    {
                                        !isMobile && <button className="transaction-table-paginate--btn" onClick={handleLastPage}>
                                            <img src={IconDoubleRight} alt="next" width={16} />
                                        </button>
                                    }
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileHistory;