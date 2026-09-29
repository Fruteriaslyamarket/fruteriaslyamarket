import { Link } from "@tanstack/react-router";

// Datos del titular (tomados del footer/negocio). Revisa y completa lo marcado [COMPLETAR].
const EMPRESA = {
  razonSocial: "Fruterías Lya, S.L.",
  nombreComercial: "Lya Market",
  cif: "B-26988139",
  domicilio: "Calle Cataluña 1, Getafe (Madrid) [COMPLETAR: código postal]",
  email: "fruteriaslyamarket@gmail.com",
  telefono: "674 559 853",
  registro: "[COMPLETAR: datos de inscripción en el Registro Mercantil, si aplica]",
};
const ACTUALIZADO = "Septiembre de 2026";

function Shell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 md:py-16">
      <h1 className="font-display text-3xl font-semibold sm:text-4xl">{title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">Última actualización: {ACTUALIZADO}</p>
      <div className="mt-8 space-y-4 text-sm leading-relaxed text-muted-foreground [&_h2]:mt-8 [&_h2]:font-display [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-foreground [&_a]:text-primary [&_a]:underline [&_strong]:text-foreground [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1">
        {children}
      </div>
    </div>
  );
}

export function AvisoLegal() {
  return (
    <Shell title="Aviso Legal">
      <p>
        En cumplimiento del artículo 10 de la Ley 34/2002, de Servicios de la Sociedad de la
        Información y de Comercio Electrónico (LSSI-CE), se informa de los datos del titular de este
        sitio web:
      </p>
      <ul>
        <li><strong>Titular:</strong> {EMPRESA.razonSocial} ({EMPRESA.nombreComercial})</li>
        <li><strong>CIF:</strong> {EMPRESA.cif}</li>
        <li><strong>Domicilio:</strong> {EMPRESA.domicilio}</li>
        <li><strong>Correo electrónico:</strong> {EMPRESA.email}</li>
        <li><strong>Teléfono:</strong> {EMPRESA.telefono}</li>
        <li><strong>Datos registrales:</strong> {EMPRESA.registro}</li>
        <li><strong>Actividad:</strong> venta de fruta, verdura y productos de alimentación con reparto a domicilio.</li>
      </ul>
      <h2>Condiciones de uso</h2>
      <p>
        El acceso y uso de este sitio web atribuye la condición de usuario y supone la aceptación de
        las presentes condiciones. El usuario se compromete a hacer un uso adecuado de los
        contenidos y a no emplearlos para actividades ilícitas.
      </p>
      <h2>Propiedad intelectual e industrial</h2>
      <p>
        Los contenidos de este sitio (textos, imágenes, logotipos y diseño) son titularidad de{" "}
        {EMPRESA.razonSocial} o de terceros que han autorizado su uso, y están protegidos por la
        normativa de propiedad intelectual e industrial. Queda prohibida su reproducción sin
        autorización.
      </p>
      <h2>Responsabilidad</h2>
      <p>
        El titular no se responsabiliza de los daños derivados de un uso inadecuado del sitio ni de
        interrupciones ajenas a su control. Se reserva el derecho de modificar los contenidos y las
        condiciones en cualquier momento.
      </p>
      <h2>Legislación aplicable</h2>
      <p>
        Estas condiciones se rigen por la legislación española. Para cualquier controversia serán
        competentes los juzgados y tribunales que correspondan conforme a la normativa aplicable en
        materia de consumidores y usuarios.
      </p>
      <p>
        Consulta también nuestra <Link to="/privacidad">Política de Privacidad</Link>, la{" "}
        <Link to="/cookies">Política de Cookies</Link> y las{" "}
        <Link to="/terminos">Condiciones de Compra</Link>.
      </p>
    </Shell>
  );
}

export function Privacidad() {
  return (
    <Shell title="Política de Privacidad">
      <p>
        {EMPRESA.razonSocial} trata tus datos personales conforme al Reglamento (UE) 2016/679
        (RGPD) y a la Ley Orgánica 3/2018 (LOPDGDD). A continuación se detalla cómo lo hacemos.
      </p>
      <h2>Responsable del tratamiento</h2>
      <ul>
        <li>{EMPRESA.razonSocial} — CIF {EMPRESA.cif}</li>
        <li>{EMPRESA.domicilio}</li>
        <li>Contacto: <a href={`mailto:${EMPRESA.email}`}>{EMPRESA.email}</a> · {EMPRESA.telefono}</li>
      </ul>
      <h2>¿Qué datos tratamos y con qué finalidad?</h2>
      <p>
        Cuando realizas un pedido recogemos tus datos de identificación y contacto (nombre,
        teléfono, correo electrónico si lo facilitas y dirección de entrega) y los detalles del
        pedido. Los usamos para:
      </p>
      <ul>
        <li>Gestionar, preparar y entregar tu pedido.</li>
        <li>Comunicarnos contigo sobre el estado del pedido.</li>
        <li>Gestionar el cobro y cumplir nuestras obligaciones contables y fiscales.</li>
      </ul>
      <h2>Base jurídica</h2>
      <ul>
        <li><strong>Ejecución del contrato</strong> (art. 6.1.b RGPD): gestión y entrega del pedido.</li>
        <li><strong>Obligación legal</strong> (art. 6.1.c RGPD): obligaciones fiscales y contables.</li>
      </ul>
      <h2>Destinatarios</h2>
      <p>
        No vendemos ni cedemos tus datos con fines comerciales. Solo los comparten los proveedores
        que nos prestan servicios como encargados del tratamiento:
      </p>
      <ul>
        <li><strong>Stripe Payments Europe, Ltd.</strong> — procesamiento de pagos con tarjeta (cuando eliges pago online).</li>
        <li><strong>Vercel Inc.</strong> — alojamiento del sitio web.</li>
        <li>En su caso, personal o servicios de reparto para entregar el pedido.</li>
        <li>Si nos contactas o confirmas el pedido por WhatsApp, se aplica también la política de Meta Platforms.</li>
      </ul>
      <p>
        Algunos proveedores pueden tratar datos fuera del Espacio Económico Europeo; en tal caso se
        aplican las garantías adecuadas previstas por el RGPD (cláusulas contractuales tipo).
      </p>
      <h2>Conservación</h2>
      <p>
        Conservamos tus datos mientras dure la relación y, después, durante los plazos legalmente
        exigibles (mercantiles y fiscales, con carácter general hasta 6 años), tras lo cual se
        suprimen o anonimizan.
      </p>
      <h2>Tus derechos</h2>
      <p>
        Puedes ejercer los derechos de acceso, rectificación, supresión, oposición, limitación y
        portabilidad escribiendo a <a href={`mailto:${EMPRESA.email}`}>{EMPRESA.email}</a>,
        indicando el derecho que deseas ejercer. Si consideras que no hemos atendido correctamente
        tu solicitud, puedes reclamar ante la Agencia Española de Protección de Datos (
        <a href="https://www.aepd.es" target="_blank" rel="noreferrer">www.aepd.es</a>).
      </p>
    </Shell>
  );
}

export function Cookies() {
  return (
    <Shell title="Política de Cookies">
      <p>
        Este sitio web es respetuoso con tu privacidad: <strong>no utilizamos cookies de análisis,
        publicidad ni seguimiento</strong> de ningún tipo.
      </p>
      <h2>Almacenamiento técnico necesario</h2>
      <p>
        Únicamente empleamos almacenamiento local del navegador (localStorage/sessionStorage) que es
        estrictamente necesario para el funcionamiento de la web, en concreto para:
      </p>
      <ul>
        <li>Recordar los productos que añades a tu cesta de la compra.</li>
        <li>Mantener la sesión del panel de administración (solo para el personal de la tienda).</li>
      </ul>
      <p>
        Este almacenamiento técnico está <strong>exento del deber de consentimiento</strong> según
        el artículo 22.2 de la LSSI-CE y las directrices de la AEPD, por lo que no se muestra un
        banner de cookies.
      </p>
      <h2>Cookies de terceros</h2>
      <p>
        Si realizas un pago online, se te redirige a la pasarela segura de <strong>Stripe</strong>,
        que puede utilizar sus propias cookies en su dominio para procesar el pago de forma segura y
        prevenir el fraude. Dicho tratamiento se rige por la política de privacidad de Stripe.
      </p>
      <h2>Cómo eliminar el almacenamiento</h2>
      <p>
        Puedes borrar en cualquier momento el almacenamiento local desde la configuración de tu
        navegador (borrar datos de navegación / datos de sitios). Ten en cuenta que, si lo haces, se
        vaciará tu cesta de la compra.
      </p>
    </Shell>
  );
}

export function Terminos() {
  return (
    <Shell title="Condiciones de Compra">
      <p>
        Las presentes condiciones regulan la compra de productos a través de este sitio web,
        titularidad de {EMPRESA.razonSocial} (CIF {EMPRESA.cif}).
      </p>
      <h2>Productos y precios</h2>
      <p>
        Los precios se muestran en euros con los impuestos incluidos. En los productos que se venden
        por peso, el importe final puede variar ligeramente respecto al estimado, ajustándose al
        peso real servido. Nos reservamos el derecho de modificar precios y disponibilidad.
      </p>
      <h2>Realización del pedido</h2>
      <p>
        Para comprar, añade productos a la cesta y completa el formulario de pedido con tus datos de
        contacto y entrega. La confirmación del pedido implica la aceptación de estas condiciones y
        de la <Link to="/privacidad">Política de Privacidad</Link>.
      </p>
      <h2>Formas de pago</h2>
      <ul>
        <li>Efectivo al recibir el pedido.</li>
        <li>Tarjeta al recibir el pedido.</li>
        <li>Pago online seguro con tarjeta a través de Stripe.</li>
      </ul>
      <h2>Entrega</h2>
      <p>
        Realizamos reparto a domicilio en Getafe, Móstoles y alrededores. Si tu dirección queda
        fuera de la zona de reparto, te avisaremos por teléfono antes de tramitar el cobro.
      </p>
      <h2>Derecho de desistimiento</h2>
      <p>
        De acuerdo con el artículo 103.d) del Real Decreto Legislativo 1/2007 (TRLGDCU),{" "}
        <strong>no existe derecho de desistimiento en los productos perecederos o de rápido
        deterioro</strong>, como la fruta, la verdura y demás alimentación fresca. Si recibes un
        producto en mal estado, contáctanos en{" "}
        <a href={`mailto:${EMPRESA.email}`}>{EMPRESA.email}</a> o en el {EMPRESA.telefono} y lo
        resolveremos (reposición o reembolso).
      </p>
      <h2>Atención al cliente</h2>
      <p>
        Para cualquier consulta, incidencia o cancelación de un pedido aún no preparado, escríbenos
        a <a href={`mailto:${EMPRESA.email}`}>{EMPRESA.email}</a> o llámanos al {EMPRESA.telefono}.
      </p>
    </Shell>
  );
}
