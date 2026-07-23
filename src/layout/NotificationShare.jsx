const NotificationShare = ({ pendingShares, onOpenShare }) => {
    if (pendingShares.length === 0) return null

    return (
        <div className="container-fluid px-2 px-md-3 mb-3">
            {pendingShares.map((share) => (
                <div
                    key={share.id}
                    className="alert alert-info d-flex align-items-center justify-content-between mb-2"
                    role="alert"
                    style={{ cursor: 'pointer' }}
                    onClick={() => onOpenShare(share)}
                >
                    <div>
                        <i className="bi bi-share me-2"></i>
                        <strong>{share.fromUserName}</strong> muốn chia sẻ contact với bạn. Ấn vào để xem chi tiết
                    </div>
                    <i className="bi bi-chevron-right"></i>
                </div>
            ))}
        </div>
    )
}

export default NotificationShare
