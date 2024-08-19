import React from 'react';

function CustomToolbar({ toolbar, openSearchModal }) {
    const goToBack = () => {
        toolbar.onNavigate('PREV');
    };

    const goToNext = () => {
        toolbar.onNavigate('NEXT');
    };

    return (
        <div className="flex justify-between items-center border-l-2 border-gray-200 bg-gray-100 py-3 px-2">
        <div className="flex items-center silkScreen">
            <button type="button" className='bg-gray-700 text-white text-sm border-2 border-gray-700 px-3 py-1 mr-2' onClick={goToBack}>Anterior</button>
            <button type="button" className='bg-green-700 text-white text-sm border-2 border-gray-700 px-3 py-1 mr-2' onClick={goToNext}>Siguiente</button>
        </div>
        <span className="font-bold text-xl silkScreen">{toolbar.label}</span>
        <div className="flex items-center silkScreen">
            <button type="button" className='bg-red-700 text-white text-sm border-2 border-gray-700 px-3 py-1 mr-2' onClick={openSearchModal}>Buscar...</button>
            <button type="button" className='bg-gray-700 text-white text-sm border-2 border-gray-700 px-3 py-1 mr-2' onClick={() => toolbar.onView('month')}>Mes</button>
        </div>
    </div>
    );
}

export default CustomToolbar;