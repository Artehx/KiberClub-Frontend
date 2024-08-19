import { Outlet, useLoaderData, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Loading from "../LoadingComponent/Loading";

function Layout() {

    const [loading, setLoading] = useState(true);
    const [showHeader, setShowHeader] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        // Oculta el encabezado mientras se está cargando
        setShowHeader(!loading);
    }, [loading]);

    return (

      
        <div className="flex flex-col">
        {showHeader && <Header />} {/* Renderiza el encabezado solo si showHeader es true */}       
        {loading ? ( 
             <Loading loading={loading} />
              ) : (
             <Outlet /> 
             )}
        
        <Footer></Footer>
        </div>
       
    )


}

export default Layout;