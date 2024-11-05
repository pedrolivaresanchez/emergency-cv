export function Card () {
    return (

<div className="container mx-auto p-4 space-y-8 max-w-7xl">
{/* Sección de Emergencia */}
<div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg shadow-lg">
  <div className="flex items-start gap-4">
    <AlertCircle className="h-6 w-6 text-red-500 flex-shrink-0" />
    <div>
      <h2 className="text-xl font-bold text-red-800 mb-2">EMERGENCIA ACTIVA - DANA</h2>
      <div className="prose prose-sm text-red-700">
        <p className="mb-2">Situación de emergencia activa por DANA en la Comunitat Valenciana.</p>
        <p className="font-medium">Para emergencias médicas inmediatas, llame al 112.</p>
      </div>
    </div>
  </div>
</div>
    )
}