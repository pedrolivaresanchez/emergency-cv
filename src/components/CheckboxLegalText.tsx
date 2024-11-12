import Link from 'next/link';

export function CheckboxLegalText() {
  return (
    <span className="text-xs text-gray-700">
      De acuerdo con lo dispuesto en la normativa vigente en materia de protección de datos personales, le informamos
      que el responsable del tratamiento de sus datos personales recogidos a través de este formulario es Pedro Olivares
      Sánchez, como responsable de AJUDADANA, cuyo NIF es 24441859N, que tratará los datos para facilitar el contacto
      entre personas que ofrecen ayuda sin ánimo de lucro y aquellas que la necesitan en las zonas afectadas por
      catástrofes naturales. Así mismo, le informamos que al rellenar este formulario y enviarlo da su consentimiento a
      AJUDADANA para tratar sus datos personales con el único fin de gestionar oferta de ayuda o su solicitud de ayuda.
      Sus datos no serán cedidos o comunicados a terceros, salvo obligación legal. Le comunicamos que puede ejercitar
      los derechos de acceso, rectificación y supresión, así como los demás derechos recogidos en la normativa de
      protección de datos personales, mediante solicitud por escrito dirigida al correo electrónico info@ajudadana.es,
      acompañando la petición de un documento que acredite su identidad. También tiene derecho a presentar una
      reclamación ante la autoridad de control española (www.aepd.es) si considera que el tratamiento no se ajusta a la
      legislación vigente. Puede obtener más información sobre el tratamiento de sus datos personales en{' '}
      <Link href="https://ajudadana.es/" className="cursor-pointer">
        https://ajudadana.es/
      </Link>
      .
    </span>
  );
}
