import { Card } from "react-bootstrap"

const ListCard = ({ contacts, groups }) => {
    const countFavourite = contacts.filter((contact) => Number(contact.isFavourite) === 1).length
    const countPhoneNumber = contacts.filter((contact) => {
        const phones = contact.phoneNumber
        if (Array.isArray(phones)) return phones.length > 0
        return Boolean(phones)
    }).length

    return (
        <div className="stats-cards">
            <Card className="card-item">
                <Card.Body>
                    <div className="d-flex align-items-center gap-3">
                        <i className="bi bi-person tabbar_item_logo" style={{ color: '#1d64fd', background: '#ecf3fd' }}></i>
                        <div>
                            <Card.Subtitle>Tổng liên hệ</Card.Subtitle>
                            <div className="card-text-top">{contacts.length}</div>
                        </div>
                    </div>
                </Card.Body>
            </Card>

            <Card className="card-item">
                <Card.Body>
                    <div className="d-flex align-items-center gap-3">
                        <i className="bi bi-folder tabbar_item_logo" style={{ color: '#259c40', background: '#ecf8ef' }}></i>
                        <div>
                            <Card.Subtitle>Nhóm</Card.Subtitle>
                            <div className="card-text-top">{groups.length}</div>
                        </div>
                    </div>
                </Card.Body>
            </Card>

            <Card className="card-item">
                <Card.Body>
                    <div className="d-flex align-items-center gap-3">
                        <i className="bi bi-bookmark-star tabbar_item_logo" style={{ color: '#FF9900', background: '#fef8eb' }}></i>
                        <div>
                            <Card.Subtitle>Yêu thích</Card.Subtitle>
                            <div className="card-text-top">{countFavourite}</div>
                        </div>
                    </div>
                </Card.Body>
            </Card>

            <Card className="card-item">
                <Card.Body>
                    <div className="d-flex align-items-center gap-3">
                        <i className="bi bi-telephone tabbar_item_logo" style={{ color: '#7834ee', background: '#f0ecfe' }}></i>
                        <div>
                            <Card.Subtitle>Có SĐT</Card.Subtitle>
                            <div className="card-text-top">{countPhoneNumber}</div>
                        </div>
                    </div>
                </Card.Body>
            </Card>
        </div>
    )
}

export default ListCard
