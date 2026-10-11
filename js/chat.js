/* V&A Recovery — asistente de consultas */
(function(){
  // Número de WhatsApp en formato internacional, solo dígitos (ej: 5491112345678).
  var WHATSAPP = "";
  var INSTAGRAM = "https://www.instagram.com/v.a_recovery/";

  var log = document.getElementById("chat-log");
  var quick = document.getElementById("chat-quick");
  var panel = document.getElementById("chat");
  var fab = document.getElementById("chat-open");
  var input = document.getElementById("chat-input");
  var started = false;

  function norm(t){return t.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"");}

  function contactLink(topic){
    var a = document.createElement("a");
    a.className = "wa"; a.target = "_blank"; a.rel = "noopener";
    if (WHATSAPP){
      var text = "Hola V&A Recovery, quiero consultar" + (topic ? " sobre " + topic : "") + ".";
      a.href = "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(text);
      a.textContent = "Escribinos por WhatsApp";
    } else {
      a.href = INSTAGRAM;
      a.textContent = "Escribinos por Instagram";
    }
    return a;
  }

  function add(text, who, topic){
    var m = document.createElement("div");
    m.className = "msg " + who;
    m.textContent = text;
    if (topic !== undefined){ m.appendChild(document.createElement("br")); m.appendChild(contactLink(topic)); }
    log.appendChild(m);
    log.scrollTop = log.scrollHeight;
  }

  var answers = [
    {k:["servicio","ofrecen","hacen","circuito","incluye","que tienen"], t:"El circuito incluye tres servicios:\n\n• Sauna húmedo: calor y humedad para favorecer la relajación y la preparación corporal.\n• Pileta de crioterapia: exposición breve y controlada al frío para acompañar la recuperación.\n• Botas de presoterapia: compresión neumática secuencial para la sensación de descanso y liviandad en las piernas."},
    {k:["sauna","calor","vapor"], t:"El sauna húmedo es una experiencia de calor y humedad orientada a favorecer la relajación y la sensación de preparación corporal dentro del circuito."},
    {k:["crio","frio","hielo","pileta","inmersion"], t:"La pileta de crioterapia es una exposición breve y controlada al frío, que puede ayudar a acompañar la sensación de recuperación después de la actividad física. Siempre se hace con indicaciones del personal."},
    {k:["preso","botas","compresion","piernas"], t:"Las botas de presoterapia aplican compresión neumática secuencial, orientada a favorecer la sensación de descanso y liviandad en las piernas."},
    {k:["seguro","seguridad","riesgo","contraindic","embaraz","presion","cardi","lesion","enfermedad","medic"], t:"Todos los servicios se ofrecen con personal capacitado, instrucciones claras y criterios de seguridad adecuados para cada persona. Si tenés una condición de salud, una lesión o estás embarazada, consultá primero con tu médico y escribinos para evaluar tu caso.", c:"seguridad y condiciones de salud"},
    {k:["equipo","club","plantel","grupo","entrenador","preparador","convenio","empresa"], t:"Trabajamos con equipos, clubes, entrenadores y preparadores que quieren sumar recuperación organizada para sus deportistas. Para armar una propuesta para tu grupo, escribinos.", c:"servicios para equipos y clubes"},
    {k:["kinesiolog","medico del deporte","derivac","profesional","colabor"], t:"Colaboramos con kinesiólogos, médicos del deporte y especialistas en rendimiento para derivaciones y trabajo conjunto responsable. Escribinos para coordinar.", c:"colaboraciones profesionales"},
    {k:["para quien","quien puede","sirve para","corredor","ciclista","triatl","aficionado","publico"], t:"V&A Recovery está pensado para deportistas de alto rendimiento, equipos y clubes, entrenadores, y personas con rutinas exigentes como corredores, ciclistas, triatletas y aficionados avanzados."},
    {k:["que es","quienes son","nosotros","v&a","recovery"], t:"V&A Recovery es un espacio especializado en recuperación y bienestar para deportistas y personas con rutinas de entrenamiento exigentes. Reunimos servicios de recuperación post-entrenamiento y post-competencia en un circuito organizado, premium y personalizado."},
    {k:["precio","cuesta","costo","valor","tarifa","pago","plan","abono","cuanto"], t:"Los precios y planes te los pasamos por mensaje para darte la opción que mejor se adapte a vos.", c:"precios y planes"},
    {k:["reserv","turno","agendar","disponib","cita"], t:"Las reservas se coordinan por mensaje. Escribinos y te ayudamos a elegir día y horario.", c:"una reserva"},
    {k:["horario","hora","abren","dias","cuando"], t:"Los horarios te los confirmamos por mensaje.", c:"horarios"},
    {k:["donde","ubicacion","direccion","queda","llegar","zona"], t:"La ubicación te la compartimos por mensaje.", c:"la ubicación"},
    {k:["dura","duracion","tiempo","cuanto tarda"], t:"La duración depende de cómo se arme tu circuito. Escribinos y te contamos según tu caso.", c:"la duración del circuito"},
    {k:["hola","buenas","buen dia","buenas tardes","buenas noches"], t:"¡Hola! ¿En qué te puedo ayudar? Podés preguntarme por los servicios, para quién es el espacio o cómo reservar."},
    {k:["gracias","genial","perfecto","ok"], t:"¡De nada! Si necesitás algo más, acá estoy."}
  ];

  function reply(q){
    var n = norm(q), best = null, score = 0;
    answers.forEach(function(a){
      var sc = 0;
      a.k.forEach(function(k){ if (n.indexOf(norm(k)) !== -1) sc += k.length; });
      if (sc > score){ score = sc; best = a; }
    });
    setTimeout(function(){
      if (best) add(best.t, "bot", best.c);
      else add("No tengo esa información, pero el equipo te responde enseguida por mensaje.", "bot", q.slice(0,80));
    }, 350);
  }

  function ask(q){ add(q, "me"); reply(q); }

  ["¿Qué servicios tienen?","¿Para quién es?","Precios","Reservar un turno","¿Es seguro?"].forEach(function(q){
    var b = document.createElement("button"); b.type = "button"; b.textContent = q;
    b.addEventListener("click", function(){ ask(q); });
    quick.appendChild(b);
  });

  function open(){
    panel.hidden = false; fab.hidden = true; fab.setAttribute("aria-expanded","true");
    if (!started){ started = true; add("¡Hola! Soy el asistente de V&A Recovery. Preguntame lo que quieras sobre el espacio y los servicios.", "bot"); }
    input.focus();
  }
  function close(){ panel.hidden = true; fab.hidden = false; fab.setAttribute("aria-expanded","false"); fab.focus(); }

  fab.addEventListener("click", open);
  document.getElementById("chat-close").addEventListener("click", close);
  document.addEventListener("keydown", function(e){ if (e.key === "Escape" && !panel.hidden) close(); });
  document.getElementById("chat-form").addEventListener("submit", function(e){
    e.preventDefault();
    var q = input.value.trim(); if (!q) return;
    input.value = ""; ask(q);
  });
})();
