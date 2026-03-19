// ============================================================
// APP.JS — Lógica completa de la aplicación vocacional
// Navegación por archivos HTML separados + localStorage
// ============================================================

// ---- Estado global ----
let currentUser = localStorage.getItem('currentUser') || null;
let isRegisterMode = false;
let editingTopicId = null;
let editingRespTema = null;
let editingRespId = null;

// ---- Inicializar usuarios si no existen ----
function getUsers() {
    return JSON.parse(localStorage.getItem('users') || '{}');
}
function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
}

// ============================================================
// TEMAS DEL FORO (localStorage)
// ============================================================
const DEFAULT_TOPICS = [
    {
        id: 1,
        titulo: '¿Qué te motivó a estudiar ingeniería en sistemas computacionales?',
        contenido: 'Hola a todos, estoy pensando en estudiar Ingeniería en Sistemas y quiero saber qué los inspiró a elegir esta carrera. ¡Gracias!',
        autor: 'Estudiante24',
        fecha: '2025-10-20T10:00:00Z',
        responses: [
            {id:1, autor:'DevOpsMaster', contenido:'La posibilidad de crear cosas nuevas y resolver problemas complejos.', fecha:'2025-10-20T11:05:00Z'},
            {id:2, autor:'Peter_Drucker', contenido:'La habilidad de automatizar procesos aburridos.', fecha:'2025-10-20T11:30:00Z'},
            {id:3, autor:'Sheryl_S', contenido:'Me gusta la lógica y las matemáticas, y tiene mucho futuro laboral.', fecha:'2025-10-20T12:00:00Z'},
            {id:4, autor:'Mark_Z', contenido:'Simplemente quería crear mi propia aplicación móvil.', fecha:'2025-10-20T13:00:00Z'},
            {id:5, autor:'TestUser1', contenido:'La verdad, por el dinero.', fecha:'2025-10-20T14:00:00Z'},
            {id:6, autor:'TestUser2', contenido:'Me gusta hackear cosas, de forma ética claro.', fecha:'2025-10-20T15:00:00Z'},
            {id:7, autor:'TestUser3', contenido:'Quería trabajar desde casa.', fecha:'2025-10-20T16:00:00Z'},
            {id:8, autor:'TestUser4', contenido:'Me inspiró una película de hackers.', fecha:'2025-10-20T17:00:00Z'},
            {id:9, autor:'TestUser5', contenido:'Quería diseñar videojuegos.', fecha:'2025-10-20T18:00:00Z'},
            {id:10, autor:'TestUser6', contenido:'Me gusta cómo funciona la inteligencia artificial.', fecha:'2025-10-20T19:00:00Z'},
            {id:11, autor:'TestUser7', contenido:'Es el lenguaje del futuro.', fecha:'2025-10-20T20:00:00Z'},
            {id:12, autor:'TestUser8', contenido:'Mi papá es ingeniero y me influenció.', fecha:'2025-10-20T21:00:00Z'},
        ]
    },
    {
        id: 2,
        titulo: '¿En qué universidad está mejor estudiar licenciatura en administración?',
        contenido: 'Estoy investigando opciones, ¿alguna recomendación de universidad que tenga un buen programa de administración en México?',
        autor: 'BuscadorUni',
        fecha: '2025-10-22T15:30:00Z',
        responses: [
            {id:1, autor:'Mark_Z', contenido:'La UV, Campus Coatzacoalcos, tiene un excelente convenio con empresas...', fecha:'2025-10-22T16:00:00Z'},
            {id:2, autor:'Peter_Drucker', contenido:'Personalmente, recomendaría el ITESCCO si te interesan más las áreas de Gestión Empresarial.', fecha:'2025-10-22T16:30:00Z'},
            {id:3, autor:'Sheryl_S', contenido:'Considera el plan de estudios. Busca uno con énfasis en Marketing Digital y Liderazgo.', fecha:'2025-10-22T17:00:00Z'},
            {id:4, autor:'AnonimoAdmin1', contenido:'La Universidad del Istmo es excelente en esta área.', fecha:'2025-10-22T18:00:00Z'},
            {id:5, autor:'AnonimoAdmin2', contenido:'Revisa también las opciones de becas en universidades privadas.', fecha:'2025-10-22T19:00:00Z'},
            {id:6, autor:'AnonimoAdmin3', contenido:'No olvides checar la bolsa de trabajo que maneja la uni para egresados.', fecha:'2025-10-22T20:00:00Z'},
            {id:7, autor:'AnonimoAdmin4', contenido:'Te recomiendo ir a un día de puertas abiertas de la universidad.', fecha:'2025-10-22T21:00:00Z'},
            {id:8, autor:'AnonimoAdmin5', contenido:'La mejor es la que esté más cerca de tu casa.', fecha:'2025-10-22T22:00:00Z'},
        ]
    },
    {
        id: 3,
        titulo: 'Consejos para elegir una carrera',
        contenido: 'Estoy indeciso, ¿qué me recomiendan considerar antes de tomar una decisión tan importante?',
        autor: 'NovatoVocacional',
        fecha: '2025-10-25T08:45:00Z',
        responses: [
            {id:1, autor:'Senior', contenido:'Busca el perfil de egreso y las materias que llevarás.', fecha:'2025-10-25T09:00:00Z'},
            {id:2, autor:'Psicologo', contenido:'Haz un test vocacional (como el que ofrece esta web 😉).', fecha:'2025-10-25T09:15:00Z'}
        ]
    }
];

function getTopics() {
    const stored = localStorage.getItem('forumTopics');
    if (!stored) {
        localStorage.setItem('forumTopics', JSON.stringify(DEFAULT_TOPICS));
        return DEFAULT_TOPICS;
    }
    return JSON.parse(stored);
}

function saveTopics(topics) {
    localStorage.setItem('forumTopics', JSON.stringify(topics));
}

// ============================================================
// DATOS DE ÁREAS VOCACIONALES
// ============================================================
const AREAS = {
    'A': {
        nombre: 'Ingenierías y Tecnología',
        carreras_ejemplo: 'Ingeniería de Software, Ingeniería Electromecánica, Ingeniería en Sistemas Computacionales, Ingeniería Mecatrónica.',
        img_file: 'tec.png',
        img_izq: 'izin.png',
        img_der: 'dein.png',
        ruta_detalles: 'carreras_ingenierias'
    },
    'B': {
        nombre: 'Ciencias de la Salud y Bienestar',
        carreras_ejemplo: 'Médico Cirujano, Enfermería, Biomédica, Odontología.',
        img_file: 'uni.png',
        img_izq: 'izme.png',
        img_der: 'deme.png',
        ruta_detalles: 'carreras_medicina'
    },
    'C': {
        nombre: 'Comunicación, Humanidades y Legal',
        carreras_ejemplo: 'Derecho, Contaduría, Trabajo Social, Gestión y Dirección de Negocios.',
        img_file: 'com.png',
        img_izq: 'izco.png',
        img_der: 'deco.jpeg',
        ruta_detalles: 'carreras_licenciaturas'
    },
    'D': {
        nombre: 'Económico Administrativas y Negocios',
        carreras_ejemplo: 'Contaduría, Administración, Derecho, Dirección de Negocios.',
        img_file: 'bi.png',
        img_izq: 'izec.png',
        img_der: 'deec.png',
        ruta_detalles: 'carreras_licenciaturas'
    },
    'E': {
        nombre: 'Artes, Diseño y Creatividad',
        carreras_ejemplo: 'Administración, Diseño Gráfico, Enseñanza de las Artes.',
        img_file: 'art.png',
        img_izq: 'izar.png',
        img_der: 'dear.png',
        ruta_detalles: 'carreras_licenciaturas'
    }
};

// ============================================================
// MAPEO DE RESPUESTAS DEL CUESTIONARIO
// ============================================================
const MAPEO = {
    p1:  {a:'A', b:'B', c:'A', d:'D', e:'E'},
    p2:  {a:'A', b:'B', c:'C', d:'D', e:'E'},
    p3:  {a:'A', b:'B', c:'D', d:'B', e:'E'},
    p4:  {a:'A', b:'B', c:'C', d:'D', e:'E'},
    p5:  {a:'A', b:'B', c:'C', d:'D', e:'E'},
    p6:  {a:'A', b:'B', c:'C', d:'D', e:'E'},
    p7:  {a:'A', b:'B', c:'C', d:'D', e:'E'},
    p8:  {a:'A', b:'B', c:'D', d:'D', e:'E'},
    p9:  {a:'A', b:'B', c:'C', d:'D', e:'E'},
    p10: {a:'A', b:'B', c:'D', d:'E'},
    p11: {a:'A', b:'B', c:'C', d:'D', e:'E'},
    p12: {a:'A', b:'B', c:'D', d:'E'},
    p13: {a:'A', b:'B', c:'C'},
    p14: {a:'A', b:'B', c:'D', d:'E'},
    p15: {a:'A', b:'B', c:'D', d:'E'}
};

// ============================================================
// DATOS DE CARRERAS POR CATEGORÍA
// ============================================================
const INGENIERIAS_LINKS = {
    "Ingeniería en Gestión Empresarial": {
        "TECNM": "https://minatitlan.tecnm.mx/index.php/ingenieria-en-gestion-empresarial/",
        "ITESCO": "https://itesco.edu.mx/ingenieria-en-gestion-empresarial/"
    },
    "Ingeniería Electromecánica": {
        "TECNM": "https://minatitlan.tecnm.mx/index.php/ingenieria-electromecanica/"
    },
    "Ingeniería en Sistemas Computacionales": {
        "TECNM": "https://minatitlan.tecnm.mx/index.php/ingenieria-en-sistemas-computacionales/",
        "ITESCO": "https://itesco.edu.mx/ingenieria-en-sistemas-computacionales/"
    },
    "Ingeniería Electrónica": {
        "TECNM": "https://minatitlan.tecnm.mx/index.php/ingenieria-electronica/",
        "ITESCO": "https://itesco.edu.mx/ingenieria-electronica/"
    },
    "Ingeniería Ambiental": {
        "TECNM": "https://minatitlan.tecnm.mx/index.php/ingenieria-ambiental/",
        "UV (Coatzacoalcos)": "https://www.uv.mx/expoorienta/ingenieria-ambiental/"
    },
    "Ingeniería Petrolera": {
        "ITESCO": "https://itesco.edu.mx/ingenieria-petrolera/",
        "UV (Coatzacoalcos)": "https://www.uv.mx/expoorienta/ingenieria-petrolera/"
    },
    "Ingeniería Mecánica Eléctrica": {
        "UV (Coatzacoalcos)": "https://www.uv.mx/expoorienta/ingenieria-mecanica-electrica/"
    },
    "Ingeniería Civil": {
        "UV (Coatzacoalcos)": "https://www.uv.mx/expoorienta/ingenieria-civil/"
    },
    "Ingeniería Química": {
        "TECNM": "https://minatitlan.tecnm.mx/index.php/ingenieria-quimica/",
        "ITESCO": "https://itesco.edu.mx/ingenieria-quimica/",
        "UV (Coatzacoalcos)": "https://www.uv.mx/expoorienta/ingenieria-quimica/"
    },
    "Ingeniería en Biotecnología": {
        "UV (Coatzacoalcos)": "https://www.uv.mx/expoorienta/ingenieria-en-biotecnologia/"
    },
    "Ingeniería de Software": {
        "UV (Coatzacoalcos)": "https://www.uv.mx/expoorienta/ingenieria-de-software/"
    },
    "Ingeniería Industrial": {
        "TECNM": "https://minatitlan.tecnm.mx/index.php/ingenieria-industrial/",
        "ITESCO": "https://itesco.edu.mx/ingenieria-industrial/"
    },
    "Ingeniería en Inteligencia Artificial": {
        "TECNM": "https://minatitlan.tecnm.mx/index.php/ingenieria-en-inteligencia-artificial/"
    },
    "Ingeniería en Desarrollo de Aplicaciones": {
        "TECNM": "https://minatitlan.tecnm.mx/index.php/ingenieria-en-desarrollo-de-aplicaciones/"
    },
    "Ingeniería Mecánica": {
        "ITESCO": "https://itesco.edu.mx/ingenieria-mecanica/"
    },
    "Ingeniería Mecatrónica": {
        "ITESCO": "https://itesco.edu.mx/ingenieria-mecatronica/"
    },
    "Ingeniería en Semiconductores": {
        "ITESCO": "https://itesco.edu.mx/ingenieria-en-semiconductoresisem-2023-244/"
    },
    "Ingeniería en Animación Digital y Efectos Visuales": {
        "ITESCO": "https://itesco.edu.mx/ingenieria-en-animacion-digital-y-efectos-visuales-iaev-2012-238/"
    },
    "Ingeniería Eléctrica": {
        "ITESCO": "https://itesco.edu.mx/ingenieria-electrica-iele-2010-209/"
    },
    "Ingeniería Ferroviaria": {
        "ITESCO": "https://itesco.edu.mx/ingenieria-ferroviariaifer-2023-245/"
    }
};

const LICENCIATURAS_LINKS = {
    "Licenciatura en Administración": {
        "TECNM": "https://minatitlan.tecnm.mx/index.php/licenciatura-en-administracion/",
        "UV (Coatzacoalcos)": "https://www.uv.mx/expoorienta/administracion/"
    },
    "Trabajo Social": {
        "UV (Minatitlán)": "https://www.uv.mx/expoorienta/trabajo-social/"
    },
    "Derecho": {
        "UV (Coatzacoalcos)": "https://www.uv.mx/expoorienta/derecho/"
    },
    "Gestión y Dirección de Negocios": {
        "UV (Coatzacoalcos)": "https://www.uv.mx/expoorienta/gestion-y-direccion-de-negocios/"
    },
    "Contaduría": {
        "UV (Coatzacoalcos)": "https://www.uv.mx/expoorienta/contaduria/"
    },
    "Enseñanza de las Artes": {
        "UV (Coatzacoalcos)": "https://www.uv.mx/expoorienta/ensenanza-de-las-artes/"
    }
};

const MEDICINA_LINKS = {
    "Médico Cirujano": {
        "UV (Minatitlán)": "https://www.uv.mx/expoorienta/medico-cirujano/",
        "UV (Coatzacoalcos)": "https://www.uv.mx/expoorienta/medico-cirujano/"
    },
    "Enfermería": {
        "UV (Minatitlán)": "https://www.uv.mx/expoorienta/enfermeria/",
        "UV (Coatzacoalcos)": "https://www.uv.mx/expoorienta/enfermeria/"
    },
    "Cirujano Dentista (Odontología)": {
        "UV (Minatitlán)": "https://www.uv.mx/expoorienta/cirujano-dentista/"
    },
    "Ingeniería Biomédica": {
        "ITESCO": "https://itesco.edu.mx/ingenieria-biomedica/"
    },
    "Ingeniería Bioquímica": {
        "ITESCO": "https://itesco.edu.mx/ingenieria-bioquimica/"
    }
};

// ============================================================
// DETECCIÓN DE PÁGINA ACTUAL
// ============================================================
function getCurrentPage() {
    const path = window.location.pathname;
    const filename = path.substring(path.lastIndexOf('/') + 1) || 'index.html';
    return filename.replace('.html', '');
}

// ============================================================
// PROTECCIÓN DE RUTAS (autenticación)
// ============================================================
const PROTECTED_PAGES = ['menu', 'cuestionario', 'foro', 'resultados'];

function requireAuth(targetUrl) {
    if (!currentUser) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

function checkProtection() {
    const page = getCurrentPage();
    if (PROTECTED_PAGES.includes(page) && !currentUser) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// ============================================================
// AUTENTICACIÓN (localStorage)
// ============================================================
function toggleAuthMode(event) {
    event.preventDefault();
    isRegisterMode = !isRegisterMode;
    document.getElementById('login-title').textContent = isRegisterMode ? 'Registrarse' : 'Iniciar Sesión';
    document.getElementById('login-btn-text').textContent = isRegisterMode ? 'Registrarse' : 'Entrar';
    document.getElementById('toggle-register').innerHTML = isRegisterMode
        ? '<a href="#" onclick="toggleAuthMode(event)">¿Ya tienes cuenta? Inicia Sesión</a>'
        : '<a href="#" onclick="toggleAuthMode(event)">¿No tienes cuenta? Regístrate</a>';
    document.getElementById('login-error').style.display = 'none';
}

function handleLogin(event) {
    event.preventDefault();
    const user = document.getElementById('login-user').value.trim();
    const pass = document.getElementById('login-pass').value.trim();
    const errorEl = document.getElementById('login-error');

    if (!user || !pass) return;

    const users = getUsers();

    if (isRegisterMode) {
        if (users[user]) {
            errorEl.textContent = 'El usuario ya existe';
            errorEl.style.display = 'block';
            return;
        }
        users[user] = pass;
        saveUsers(users);
        currentUser = user;
        localStorage.setItem('currentUser', user);
        window.location.href = 'menu.html';
    } else {
        if (users[user] && users[user] === pass) {
            currentUser = user;
            localStorage.setItem('currentUser', user);
            window.location.href = 'menu.html';
        } else {
            errorEl.textContent = 'Usuario o contraseña incorrectos';
            errorEl.style.display = 'block';
        }
    }

    // Limpiar formulario
    document.getElementById('login-user').value = '';
    document.getElementById('login-pass').value = '';
}

function logout(event) {
    event.preventDefault();
    currentUser = null;
    localStorage.removeItem('currentUser');
    localStorage.removeItem('googleUser');
    window.location.href = 'index.html';
}

function toggleUserMenu() {
    const menu = document.getElementById('user-menu');
    menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
}

// ============================================================
// FIREBASE + GOOGLE SIGN-IN
// ============================================================
// Configuración de Firebase — REEMPLAZA con tus datos de Firebase Console
const FIREBASE_CONFIG = {
    apiKey: "TU_API_KEY",
    authDomain: "TU_PROYECTO.firebaseapp.com",
    projectId: "TU_PROYECTO",
    storageBucket: "TU_PROYECTO.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abc123"
};

let firebaseReady = false;

function loadFirebase() {
    return new Promise(function(resolve) {
        if (firebaseReady) { resolve(); return; }

        const script1 = document.createElement('script');
        script1.src = 'https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js';
        script1.onload = function() {
            const script2 = document.createElement('script');
            script2.src = 'https://www.gstatic.com/firebasejs/10.14.1/firebase-auth-compat.js';
            script2.onload = function() {
                if (!firebase.apps.length) {
                    firebase.initializeApp(FIREBASE_CONFIG);
                }
                firebaseReady = true;
                resolve();
            };
            document.head.appendChild(script2);
        };
        document.head.appendChild(script1);
    });
}

function loginWithGoogle() {
    const btn = document.getElementById('google-login-btn');
    if (btn) {
        btn.disabled = true;
        btn.textContent = 'Conectando...';
    }

    loadFirebase().then(function() {
        var provider = new firebase.auth.GoogleAuthProvider();
        return firebase.auth().signInWithPopup(provider);
    }).then(function(result) {
        var user = result.user;
        var googleUser = {
            name: user.displayName || user.email,
            email: user.email,
            picture: user.photoURL || ''
        };

        currentUser = googleUser.name;
        localStorage.setItem('currentUser', googleUser.name);
        localStorage.setItem('googleUser', JSON.stringify(googleUser));
        window.location.href = 'menu.html';
    }).catch(function(error) {
        console.error('Error Google Sign-In:', error);
        var errorEl = document.getElementById('login-error');
        if (errorEl) {
            if (error.code === 'auth/popup-closed-by-user') {
                errorEl.textContent = 'Inicio de sesión cancelado';
            } else if (error.code === 'auth/api-key-not-valid.-please-pass-a-valid-api-key.') {
                errorEl.textContent = 'Error: Configura tu Firebase API Key en app.js';
            } else {
                errorEl.textContent = 'Error al iniciar sesión con Google: ' + (error.message || error.code);
            }
            errorEl.style.display = 'block';
        }
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = '<svg width="20" height="20" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg> Acceder con Google';
        }
    });
}

// ============================================================
// MENÚ HAMBURGUESA (responsive)
// ============================================================
function toggleNav() {
    const nav = document.getElementById('nav-public');
    if (nav) {
        nav.classList.toggle('nav-open');
    }
}

// Cerrar menú de usuario al hacer clic fuera
window.addEventListener('click', function(event) {
    const menu = document.getElementById('user-menu');
    const btn = document.getElementById('usuario-btn');
    if (menu && btn && !btn.contains(event.target) && !menu.contains(event.target)) {
        menu.style.display = 'none';
    }
});

// ============================================================
// CUESTIONARIO VOCACIONAL
// ============================================================
function processQuiz(event) {
    event.preventDefault();

    const form = document.getElementById('quiz-form');
    const puntuaciones = { A: 0, B: 0, C: 0, D: 0, E: 0 };

    for (let i = 1; i <= 15; i++) {
        const key = 'p' + i;
        const selected = form.querySelector(`input[name="${key}"]:checked`);
        if (selected && MAPEO[key] && MAPEO[key][selected.value]) {
            puntuaciones[MAPEO[key][selected.value]]++;
        }
    }

    // Encontrar área ganadora
    let maxKey = 'A';
    let maxVal = 0;
    for (const [k, v] of Object.entries(puntuaciones)) {
        if (v > maxVal) {
            maxVal = v;
            maxKey = k;
        }
    }

    // Guardar resultado en localStorage para que resultados.html lo lea
    localStorage.setItem('quizResult', maxKey);
    window.location.href = 'resultados.html';
}

function initResultados() {
    const maxKey = localStorage.getItem('quizResult');
    if (!maxKey || !AREAS[maxKey]) {
        window.location.href = 'menu.html';
        return;
    }

    const resultado = AREAS[maxKey];

    document.getElementById('result-area-nombre').textContent = resultado.nombre;
    document.getElementById('result-img-izq').src = 'static/' + resultado.img_izq;
    document.getElementById('result-img-der').src = 'static/' + resultado.img_der;

    const carrerasList = document.getElementById('result-carreras-list');
    carrerasList.innerHTML = '';
    resultado.carreras_ejemplo.split(', ').forEach(c => {
        const li = document.createElement('li');
        li.textContent = c.replace('.', '');
        carrerasList.appendChild(li);
    });

    const btnDetalles = document.getElementById('result-btn-detalles');
    btnDetalles.href = resultado.ruta_detalles + '.html';
    btnDetalles.textContent = 'Ver más detalles de ' + resultado.nombre;
}

// ============================================================
// CARRERAS: llenar listas y modal
// ============================================================
let currentCareerLinks = null;

function initCareerList(careerData, listId1, listId2) {
    const allCareers = Object.keys(careerData);
    const list1 = document.getElementById(listId1);
    const list2 = document.getElementById(listId2);
    const midpoint = Math.ceil(allCareers.length / 2);

    list1.innerHTML = '';
    list2.innerHTML = '';

    allCareers.forEach((career, index) => {
        const li = document.createElement('li');
        li.textContent = career;
        li.addEventListener('click', () => showLinks(career, careerData));

        if (index < midpoint) {
            list1.appendChild(li);
        } else {
            list2.appendChild(li);
        }
    });
}

function showLinks(title, careerData) {
    currentCareerLinks = careerData;
    const modal = document.getElementById('linkModal');
    const modalTitle = document.getElementById('modalTitle');
    const linksContainer = document.getElementById('linksContainer');

    modalTitle.textContent = title;
    linksContainer.innerHTML = '';

    const links = careerData[title] || {};
    const universities = Object.keys(links);

    if (universities.length === 0) {
        linksContainer.innerHTML = '<p style="color:red;text-align:center;margin-top:16px;font-weight:600;">Lo sentimos, no hay enlaces disponibles para esta carrera.</p>';
    } else {
        universities.forEach(university => {
            const link = links[university];
            const button = document.createElement('a');
            button.href = link;
            button.target = '_blank';
            button.classList.add('link-button');

            if (university === 'TECNM' || university.includes('TECNM')) {
                button.classList.add('btn-tecnm');
                button.textContent = 'Ver en TECNM Minatitlán';
            } else if (university === 'ITESCO' || university.includes('ITESCO')) {
                button.classList.add('btn-itesco');
                button.textContent = 'Ver en ITESCO';
            } else if (university.includes('UV (Coatzacoalcos)')) {
                button.classList.add('btn-uv-coatza');
                button.textContent = 'Ver en UV Coatzacoalcos';
            } else if (university.includes('UV (Minatitlán)')) {
                button.classList.add('btn-uv-mina');
                button.textContent = 'Ver en UV Minatitlán';
            } else {
                button.style.backgroundColor = '#6b7280';
                button.textContent = 'Ver en ' + university;
            }

            linksContainer.appendChild(button);
        });
    }

    modal.classList.add('show');
}

function closeModal() {
    document.getElementById('linkModal').classList.remove('show');
}

// Cerrar modal al hacer clic fuera
window.addEventListener('click', function(event) {
    const modal = document.getElementById('linkModal');
    if (modal && event.target === modal) {
        closeModal();
    }
});

// ============================================================
// FORO
// ============================================================
function renderForum() {
    const topics = getTopics();
    const container = document.getElementById('topics-list');
    const foroUsuario = document.getElementById('foro-usuario');

    foroUsuario.textContent = currentUser || '';
    container.innerHTML = '';

    // Ordenar por id descendente (más reciente primero)
    const sorted = [...topics].sort((a, b) => b.id - a.id);

    sorted.forEach(tema => {
        const wrapper = document.createElement('div');
        wrapper.className = 'topic-wrapper';
        wrapper.id = 'topic-' + tema.id;

        const respCount = tema.responses ? tema.responses.length : 0;

        let editBtn = '';
        if (currentUser === tema.autor) {
            editBtn = `<button class="btn-small secondary" onclick="openEdit(${tema.id})">Editar</button>`;
        }

        let responsesHTML = `
            <div class="response">
                <div style="white-space:pre-wrap;">${escapeHtml(tema.contenido)}</div>
            </div>
        `;

        if (tema.responses) {
            tema.responses.forEach(resp => {
                let editRespBtn = '';
                if (resp.autor === currentUser) {
                    editRespBtn = `<button class="btn-small" onclick="openEditResponse(${tema.id}, ${resp.id}, this)">editar</button>`;
                }
                responsesHTML += `
                    <div class="response" id="resp-${tema.id}-${resp.id}">
                        <div class="response-user">
                            <span>${escapeHtml(resp.autor)} · ${resp.fecha.substring(0, 16)}</span>
                            ${editRespBtn}
                        </div>
                        <div style="white-space:pre-wrap;">${escapeHtml(resp.contenido)}</div>
                    </div>
                `;
            });
        }

        wrapper.innerHTML = `
            <div class="topic-card">
                <div class="topic-title">
                    <img src="static/foro.png">
                    <div>
                        <strong>${escapeHtml(tema.titulo)}</strong>
                        <div>Publicado por <b>${escapeHtml(tema.autor)}</b> · ${tema.fecha.substring(0, 16)}</div>
                    </div>
                </div>
                <div>
                    <button class="btn-small" onclick="toggleResponses('responses-${tema.id}')">${respCount} resp</button>
                    ${editBtn}
                    <button class="btn-small" onclick="scrollToReply(${tema.id})">Responder</button>
                </div>
            </div>
            <div id="responses-${tema.id}" class="responses-container">
                ${responsesHTML}
                <div class="reply-form">
                    <textarea id="reply-input-${tema.id}" placeholder="Escribe tu respuesta..."></textarea>
                    <button onclick="sendReply(${tema.id})">Responder</button>
                </div>
            </div>
        `;

        container.appendChild(wrapper);
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function toggleResponses(id) {
    const c = document.getElementById(id);
    c.style.display = c.style.display === 'block' ? 'none' : 'block';
}

function scrollToReply(id) {
    toggleResponses('responses-' + id);
    setTimeout(() => {
        const input = document.getElementById('reply-input-' + id);
        if (input) input.focus();
    }, 100);
}

function createTopic(event) {
    event.preventDefault();
    const titulo = document.getElementById('input-titulo').value.trim();
    const contenido = document.getElementById('input-comentario').value.trim();
    if (!titulo || !contenido) return;

    const topics = getTopics();
    const maxId = topics.reduce((max, t) => Math.max(max, t.id), 0);

    topics.push({
        id: maxId + 1,
        titulo: titulo,
        contenido: contenido,
        autor: currentUser,
        fecha: new Date().toISOString(),
        responses: []
    });

    saveTopics(topics);
    document.getElementById('input-titulo').value = '';
    document.getElementById('input-comentario').value = '';
    renderForum();
}

function sendReply(temaId) {
    const input = document.getElementById('reply-input-' + temaId);
    const txt = input.value.trim();
    if (!txt) return;

    const topics = getTopics();
    const tema = topics.find(t => t.id === temaId);
    if (!tema) return;

    const maxRespId = tema.responses.reduce((max, r) => Math.max(max, r.id || 0), 0);

    tema.responses.push({
        id: maxRespId + 1,
        autor: currentUser,
        contenido: txt,
        fecha: new Date().toISOString()
    });

    saveTopics(topics);
    renderForum();
    // Re-abrir las respuestas
    setTimeout(() => {
        const respContainer = document.getElementById('responses-' + temaId);
        if (respContainer) respContainer.style.display = 'block';
    }, 50);
}

// ---- Editar tema ----
function openEdit(id) {
    editingTopicId = id;
    const topics = getTopics();
    const tema = topics.find(t => t.id === id);
    if (!tema) return;

    document.getElementById('edit-titulo').value = tema.titulo;
    document.getElementById('edit-contenido').value = tema.contenido;
    document.getElementById('edit-overlay').classList.add('show');
}

function closeEdit() {
    document.getElementById('edit-overlay').classList.remove('show');
}

function submitEdit() {
    const titulo = document.getElementById('edit-titulo').value.trim();
    const contenido = document.getElementById('edit-contenido').value.trim();
    if (!titulo && !contenido) return;

    const topics = getTopics();
    const tema = topics.find(t => t.id === editingTopicId);
    if (!tema || tema.autor !== currentUser) return;

    if (titulo) tema.titulo = titulo;
    if (contenido) tema.contenido = contenido;

    saveTopics(topics);
    closeEdit();
    renderForum();
}

// ---- Editar respuesta ----
function openEditResponse(temaId, respId, btnElement) {
    editingRespTema = temaId;
    editingRespId = respId;

    const topics = getTopics();
    const tema = topics.find(t => t.id === temaId);
    if (!tema) return;
    const resp = tema.responses.find(r => r.id === respId);
    if (!resp) return;

    document.getElementById('edit-resp-contenido').value = resp.contenido;
    document.getElementById('edit-resp-overlay').classList.add('show');
}

function closeEditResponse() {
    document.getElementById('edit-resp-overlay').classList.remove('show');
}

function submitEditResponse() {
    const contenido = document.getElementById('edit-resp-contenido').value.trim();
    if (!contenido) return;

    const topics = getTopics();
    const tema = topics.find(t => t.id === editingRespTema);
    if (!tema) return;
    const resp = tema.responses.find(r => r.id === editingRespId);
    if (!resp || resp.autor !== currentUser) return;

    resp.contenido = contenido;
    saveTopics(topics);
    closeEditResponse();
    renderForum();

    // Re-abrir respuestas
    setTimeout(() => {
        const respContainer = document.getElementById('responses-' + editingRespTema);
        if (respContainer) respContainer.style.display = 'block';
    }, 50);
}

// ============================================================
// INICIALIZACIÓN POR PÁGINA
// ============================================================
window.addEventListener('DOMContentLoaded', function() {
    // Verificar protección de ruta
    if (!checkProtection()) return;

    const page = getCurrentPage();

    switch (page) {
        case 'index':
            // Landing - no requiere inicialización especial
            break;

        case 'login':
            // Login page - ya tiene event handlers en el HTML
            break;

        case 'menu':
            // Mostrar nombre de usuario y avatar de Google si existe
            const usuarioBtn = document.getElementById('usuario-btn');
            if (usuarioBtn) usuarioBtn.textContent = currentUser || '';
            const googleData = localStorage.getItem('googleUser');
            if (googleData) {
                try {
                    const gUser = JSON.parse(googleData);
                    if (gUser.picture) {
                        const avatar = document.getElementById('user-avatar');
                        if (avatar) {
                            avatar.src = gUser.picture;
                            avatar.alt = gUser.name;
                            avatar.style.display = 'inline-block';
                        }
                    }
                } catch(e) {}
            }
            break;

        case 'cuestionario':
            // Cuestionario - ya tiene event handlers en el HTML
            break;

        case 'resultados':
            initResultados();
            break;

        case 'carreras_ingenierias':
            initCareerList(INGENIERIAS_LINKS, 'ing-career-list-1', 'ing-career-list-2');
            break;

        case 'carreras_licenciaturas':
            initCareerList(LICENCIATURAS_LINKS, 'lic-career-list-1', 'lic-career-list-2');
            break;

        case 'carreras_medicina':
            initCareerList(MEDICINA_LINKS, 'med-career-list-1', 'med-career-list-2');
            break;

        case 'foro':
            renderForum();
            break;
    }

    // Inicializar modales de edición del foro (solo en foro.html)
    const editOverlay = document.getElementById('edit-overlay');
    if (editOverlay) {
        editOverlay.addEventListener('click', function(e) {
            if (e.target === this) closeEdit();
        });
    }
    const editRespOverlay = document.getElementById('edit-resp-overlay');
    if (editRespOverlay) {
        editRespOverlay.addEventListener('click', function(e) {
            if (e.target === this) closeEditResponse();
        });
    }
});
