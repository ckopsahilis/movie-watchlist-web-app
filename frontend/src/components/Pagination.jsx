export default function Pagination({ page, totalPages, onPageChange }) {
    if (totalPages <= 1) return null;

    const pages = [];
    for (let p = 1; p <= totalPages; p++) {
        if (p === page || p <= 2 || p >= totalPages - 1 || (p >= page - 1 && p <= page + 1)) {
            pages.push(p);
        } else if (p === 3 && page > 4) {
            pages.push('...');
        } else if (p === totalPages - 2 && page < totalPages - 3) {
            pages.push('...');
        }
    }

    // Deduplicate ellipses
    const renderPages = pages.filter((item, index, arr) => 
        item !== '...' || arr[index - 1] !== '...'
    );

    return (
        <nav className="pagination">
            {page > 1 ? (
                <a href="#" onClick={(e) => { e.preventDefault(); onPageChange(page - 1); }}>Prev</a>
            ) : (
                <span className="disabled">Prev</span>
            )}

            {renderPages.map((p, index) => {
                if (p === '...') {
                    return <span key={`ellipsis-${index}`} className="ellipsis">...</span>;
                }
                if (p === page) {
                    return <span key={p} className="current">{p}</span>;
                }
                return (
                    <a key={p} href="#" onClick={(e) => { e.preventDefault(); onPageChange(p); }}>
                        {p}
                    </a>
                );
            })}

            {page < totalPages ? (
                <a href="#" onClick={(e) => { e.preventDefault(); onPageChange(page + 1); }}>Next</a>
            ) : (
                <span className="disabled">Next</span>
            )}
        </nav>
    );
}
