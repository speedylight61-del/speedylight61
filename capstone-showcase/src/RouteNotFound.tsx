
import Footer from "../src/Pages/Footer";
import '../src/CSS/pagenotfound.css';
export function RouteNotFound()
{
    return (
        <>
        <div className="not-found-container">
            <h1>404 - Page Not Found</h1>
            <p>\_(ツ)_/¯</p>
            <p>The page you are looking for does not exist.</p>
            <button onClick={() => window.location.href = '/'}>Go to Home Page</button>
        </div>
            <Footer />
        </>
    );
}