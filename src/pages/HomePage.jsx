import Body from "../layout/Body"
import Footer from "../layout/Footer"
import Header from "../layout/Header"
import "../style/styline.css"

const HomePage = () => {
    return (
        <div className="page-with-header-footer">
            <Header />
            <Body />
            <Footer />
        </div>
    )
}

export default HomePage
