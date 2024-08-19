

function RegistroOK() {

    return (
     
        <div className="flex items-center justify-center min-h-screen bg-gray-100 background-pattern">
        <div className="text-center">
        <section className="py-4 mr-4 rounded-xs border-4 border-green-600 bg-white" style={{ minWidth: '645px', maxWidth:'820px' }}>
          <h1 className="text-4xl font-bold text-green-600 mb-4">¡Registro exitoso!</h1>
          <p className="text-lg silkScreen text-gray-800">¡Gracias por registrarte con nosotros!</p>
          <p className="text-lg silkScreen text-gray-800 mb-8"><span className="text-red-600">Confirma la cuenta</span> para loguearte 👀</p>
          <img src="/images/check.png" alt="Registro Exitoso" className="w-64 h-64 ml-48 mb-4" />
          
          </section>
        </div>
       
      </div>

    )

}

export default RegistroOK;