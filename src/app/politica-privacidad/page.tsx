import Link from 'next/link';

export default function politicaPrivacidad() {
  return (
    <div className="flex flex-col gap-6 [&>article>h2]:text-xl [&>article>h2]:font-semibold [&>article>h2]:mb-2 [&>article>p>a]:text-blue-500 [&>article>ul]:list-disc [&>article>ul]:ml-5">
      <h1 className="text-center text-4xl font-bold">Politica de privacidad</h1>
      <article>
        <h2>1. Normativa de aplicación</h2>
        <p>
          Los datos de carácter personal obtenidos a través del sitio web{' '}
          <Link href="https://ajudadana.es/">https://ajudadana.es/</Link> serán tratados conforme al Reglamento (UE)
          2016/679 del Parlamento Europeo y del Consejo de 27 de abril de 2016, relativo a la protección de las personas
          físicas en lo que respecta al tratamiento de datos personales y a la libre circulación de estos datos y por el
          que se deroga la Directiva 95/46/CE (Reglamento general de protección de datos) y a la Ley Orgánica 3/2018, de
          5 de diciembre, de Protección de Datos Personales y garantía de los derechos digitales.
        </p>
      </article>
      <article>
        <h2>2. Responsable del tratamiento</h2>
        <p>
          Pedro Olivares Sánchez, NIF 24448195N, ha creado, junto con otras personas voluntarias, independientes de
          cualquier organismo, la plataforma ajudadana.es con el objetivo de facilitar el contacto entre personas que
          ofrecen ayuda sin ánimo de lucro y aquellas que la necesitan en las zonas afectadas por catástrofes naturales.
          Para la consecución de estos fines, se necesita obtener de los interesados datos de carácter personal y
          tratarlos de forma confidencial.
        </p>
      </article>
      <article>
        <h2>3. Datos Personales que Recopilamos</h2>
        <p>
          Recopilamos datos personales para facilitar el contacto entre personas que ofrecen ayuda sin ánimo de lucro y
          aquellas que la necesitan en las zonas afectadas por catástrofes naturales. Los datos recopilados incluyen:
        </p>
        <ul>
          <li>Datos obligatorios: nombre, correo electrónico para el registro, número de teléfono y ubicación.</li>
          <li>Datos opcionales: descripción de las necesidades de ayuda.</li>
        </ul>
        <p>
          <span className="font-bold">Nota</span>: No proporciones ningún dato que no esté indicado en el formulario
          como DNI o cuentas bancarias.
        </p>
      </article>
      <article>
        {' '}
        <h2>4. Finalidad y Base Legal del Tratamiento de Datos</h2>
        <p>
          <span className="font-bold">Finalidad</span>: Facilitar la conexión entre personas que ofrecen y requieren
          ayuda en las áreas afectadas.
        </p>
        <p>
          <span className="font-bold">Base legal</span>: El tratamiento de los datos se basa en el consentimiento
          expreso del usuario, otorgado al registrarse y rellenar el formulario de solicitud de ayuda.
        </p>
      </article>
      <article>
        <h2>5. Consentimiento para la Recopilación y Publicación de Datos</h2>
        <p>
          Al registrarse y rellenar el formulario de solicitud o de oferta de ayuda, el usuario otorga su consentimiento
          para la recopilación y, cuando lo autorice expresamente, la publicación en{' '}
          <Link href="https://ajudadana.es/">https://ajudadana.es/</Link> de su ubicación en el mapa, número de teléfono
          y necesidades. Este consentimiento es revocable en cualquier momento. Para revocar el consentimiento de
          publicación, envía un correo a <a href="malto:info@ajudadana.es">info@ajudadana.es</a>, indicando ELIMINACIÓN
          DE SOLICITUD DE AYUDA EN EL MAPA, junto con el correo de registro y la ubicación aproximada. Responderemos en
          un plazo máximo de 30 días.
        </p>
      </article>
      <article>
        {' '}
        <h2>6. Duración de Conservación de los Datos</h2>
        <p>
          Los datos se conservarán durante el tiempo necesario para cumplir con la finalidad para la que fueron
          obtenidos, pudiéndose conservar también para la resolución de las posibles responsabilidades que se pudieran
          derivar de su tratamiento. En todo caso, serán conservados durante la emergencia y hasta un máximo de 6 meses
          después de la normalización de la situación, momento en el cual serán eliminados y destruidos de forma segura.{' '}
        </p>
      </article>
      <article>
        {' '}
        <h2>7. Derechos de los Usuarios</h2>
        <p>De acuerdo con el RGPD, los usuarios tienen derecho a:</p>
        <ul>
          <li>Acceso: Solicitar una copia de sus datos personales.</li>
          <li>Rectificación: Modificar información incorrecta.</li>
          <li>Supresión: Solicitar la eliminación de sus datos en cualquier momento.</li>
          <li>Oposición y Limitación del Tratamiento: Oponerse al tratamiento o limitar su uso.</li>
          <li>Portabilidad: Solicitar que sus datos sean transferidos a otra entidad.</li>
          <li>A no ser objeto de decisiones basadas únicamente en el tratamiento automatizado de sus datos.</li>
        </ul>
        <p>
          Para ejercer estos derechos, envía una solicitud a <a href="malto:info@ajudadana.es">info@ajudadana.es</a>,
          incluyendo el derecho específico que deseas ejercer. La solicitud se procesará en un plazo de 30 días.
          Asimismo, los interesados tienen derecho a presentar una reclamación ante la Agencia Española de Protección de
          Datos, a través de su dirección postal en la calle Jorge Juan nº 6, 28001-Madrid, o a través del siguiente
          enlace a su sede electrónica.
        </p>
      </article>
      <article>
        {' '}
        <h2>8. Seguridad de los Datos</h2>
        <p>
          Implementamos medidas técnicas y organizativas para proteger los datos personales. En caso de una violación de
          seguridad que pueda afectar los derechos y libertades de los usuarios, notificaremos a la AEPD en un plazo de
          72 horas y, si procede, a los usuarios afectados.
        </p>
      </article>
      <article>
        {' '}
        <h2>9. Comunicación de Datos a Terceros</h2>
        <p>
          Actualmente, los datos personales no se comunicarán a terceros sin el previo consentimiento de los
          interesados, salvo que exista una obligación legal. Además, Ayuda Dana no realiza transferencias de datos
          personales fuera del Espacio Económico Europeo (EEE). Si esto cambia, se informará y solicitará el
          consentimiento explícito de los usuarios.
        </p>
      </article>
      <article>
        {' '}
        <h2>10. Privacidad de los Menores</h2>
        <p>
          El sitio no está dirigido a menores de 18 años. Si un padre/madre o tutor/a legal detecta que un/a menor ha
          proporcionado datos personales sin el debido consentimiento, debe contactar con nosotros en{' '}
          <a href="malto:info@ajudadana.es">info@ajudadana.es</a> para su eliminación.
        </p>
      </article>
      <article>
        {' '}
        <h2>11. Modificaciones de la Política de Privacidad</h2>
        <p>
          Ayuda Dana se reserva el derecho de modificar esta Política de Privacidad. En caso de cambios sustanciales,
          notificaremos a los usuarios registrados y solicitaremos nuevamente su consentimiento si los cambios implican
          un uso ampliado de sus datos.
        </p>
      </article>
      <article>
        {' '}
        <h2>12. Contacto</h2>
        <p>
          Para preguntas sobre nuestra Política de Privacidad o el uso de tus datos, contáctanos en{' '}
          <a href="mailto:info@ajudadana.es">info@ajudadana.es</a>
        </p>
      </article>
      <p>Última actualización: 12 de noviembre de 2024</p>
    </div>
  );
}
