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


async function getTopics() {
    await loadFirebase();
    const db = firebase.firestore();
    const snapshot = await db.collection('topics').get();
    let topics = [];
    snapshot.forEach(doc => {
        let data = doc.data();
        data.id = parseInt(doc.id);
        topics.push(data);
    });
    if (topics.length === 0) {
        const batch = db.batch();
        DEFAULT_TOPICS.forEach(t => {
            const docRef = db.collection('topics').doc(t.id.toString());
            batch.set(docRef, t);
        });
        await batch.commit();
        return DEFAULT_TOPICS;
    }
    return topics;
}

async function saveTopic(tema) {
    await loadFirebase();
    await firebase.firestore().collection('topics').doc(tema.id.toString()).set(tema);
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
const PROTECTED_PAGES = ['menu', 'cuestionario', 'foro', 'resultados', 'perfil', 'chat', 'admin'];

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


async function handleLogin(event) {
    event.preventDefault();
    const user = document.getElementById('login-user').value.trim();
    const pass = document.getElementById('login-pass').value.trim();
    const errorEl = document.getElementById('login-error');

    if (!user || !pass) return;

    let email = user;
    if(!email.includes('@')) {
        email = email + "@vocacional.com";
    }

    try {
        await loadFirebase();
        const btn = document.getElementById('login-btn-text');
        btn.textContent = 'Cargando...';
        btn.disabled = true;

        if (isRegisterMode) {
            await firebase.auth().createUserWithEmailAndPassword(email, pass);
        } else {
            await firebase.auth().signInWithEmailAndPassword(email, pass);
        }
        
        currentUser = user;
        localStorage.setItem('currentUser', user);
        window.location.href = 'menu.html';
    } catch(error) {
        errorEl.textContent = 'Error: ' + error.message;
        errorEl.style.display = 'block';
        const btn = document.getElementById('login-btn-text');
        btn.textContent = isRegisterMode ? 'Registrarse' : 'Entrar';
        btn.disabled = false;
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
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyCmLg0ibip9P_F45-n4rYZx3HXKW4g-AVk",
  authDomain: "orientatec-32569.firebaseapp.com",
  projectId: "orientatec-32569",
  storageBucket: "orientatec-32569.firebasestorage.app",
  messagingSenderId: "880930622295",
  appId: "1:880930622295:web:087fbf600cb381e955cc12",
  measurementId: "G-FVNBN26EQH"
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
            const script3 = document.createElement('script');
            script3.src = 'https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore-compat.js';
            
            let loaded = 0;
            const checkLoaded = () => {
                loaded++;
                if (loaded === 2) {
                    if (!firebase.apps.length) {
                        firebase.initializeApp(FIREBASE_CONFIG);
                    }
                    firebaseReady = true;
                    resolve();
                }
            };
            script2.onload = checkLoaded;
            script3.onload = checkLoaded;
            
            document.head.appendChild(script2);
            document.head.appendChild(script3);
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

async function processQuiz(event) {
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

    let maxKey = 'A';
    let maxVal = 0;
    for (const [k, v] of Object.entries(puntuaciones)) {
        if (v > maxVal) {
            maxVal = v;
            maxKey = k;
        }
    }

    localStorage.setItem('quizResult', maxKey);
    
    // Save to firebase
    if (currentUser) {
        try {
            await loadFirebase();
            let email = currentUser;
            if(!email.includes('@')) email = email + "@vocacional.com";
            await firebase.firestore().collection('users').doc(email).set({
                lastQuizResult: maxKey,
                date: new Date().toISOString()
            }, { merge: true });
        } catch(e) {
            console.error("No se pudo guardar en firebase", e);
        }
    }

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

        // Add Favorite Button
        const favBtn = document.createElement('button');
        favBtn.id = 'fav-btn-modal';
        favBtn.style.marginTop = '15px';
        favBtn.style.background = '#f59e0b';
        favBtn.style.color = 'white';
        favBtn.style.border = 'none';
        favBtn.style.padding = '10px 15px';
        favBtn.style.borderRadius = '8px';
        favBtn.style.cursor = 'pointer';
        favBtn.style.fontWeight = 'bold';
        favBtn.textContent = '⭐ Guardar en Favoritos';
        favBtn.onclick = () => toggleFavorite(title);
        
        // Check if already in favorites
        if (currentUser) {
            loadFirebase().then(() => {
                let emailId = currentUser.includes('@') ? currentUser : currentUser + "@vocacional.com";
                firebase.firestore().collection('users').doc(emailId).get().then(doc => {
                    if (doc.exists && doc.data().favoritos && doc.data().favoritos.includes(title)) {
                        favBtn.textContent = '⭐ Guardada';
                    }
                });
            });
        }

        linksContainer.appendChild(favBtn);
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
async function renderForum() {
    let topics = [];
    try {
        topics = await getTopics();
    } catch (error) {
        console.error("Error al cargar temas del foro:", error);
        document.getElementById('topics-list').innerHTML = `<p style="color:red; text-align:center;">Error al cargar el foro. Asegúrate de tener permisos en Firebase. Detalle: ${error.message}</p>`;
        return;
    }
    const container = document.getElementById('topics-list');
    const foroUsuario = document.getElementById('foro-usuario');

    foroUsuario.textContent = currentUser || '';
    container.innerHTML = '';

    // Ordenar por id descendente (más reciente primero)
    window.currentTopicsForFilter = [...topics].sort((a, b) => b.id - a.id);
    renderTopicsList(window.currentTopicsForFilter);
}

function renderTopicsList(topicsToRender) {
    const container = document.getElementById('topics-list');
    container.innerHTML = '';

    topicsToRender.forEach(tema => {
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

        const likesCount = tema.likes ? tema.likes.length : 0;
        const hasLiked = tema.likes && tema.likes.includes(currentUser);
        const likeBtnStyle = hasLiked ? 'color: #ef4444; font-weight: bold;' : 'color: #64748b;';

        wrapper.innerHTML = `
            <div class="topic-card">
                <div class="topic-title">
                    <img src="static/foro.png">
                    <div>
                        <strong>${escapeHtml(tema.titulo)}</strong>
                        <div>Publicado por <b>${escapeHtml(tema.autor)}</b> · ${tema.fecha.substring(0, 16)}</div>
                    </div>
                </div>
                <div style="display: flex; gap: 5px; align-items: center; flex-wrap: wrap;">
                    <button class="btn-small" style="${likeBtnStyle}" onclick="toggleLike(${tema.id})">❤️ ${likesCount}</button>
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

function filterForum(query) {
    if (!window.currentTopicsForFilter) return;
    const q = query.toLowerCase();
    const filtered = window.currentTopicsForFilter.filter(t => 
        t.titulo.toLowerCase().includes(q) || 
        t.contenido.toLowerCase().includes(q) ||
        t.autor.toLowerCase().includes(q)
    );
    renderTopicsList(filtered);
}

async function toggleLike(temaId) {
    if (!currentUser) {
        alert("Debes iniciar sesión para dar me gusta.");
        return;
    }
    try {
        const topics = await getTopics();
        const tema = topics.find(t => t.id === temaId);
        if (!tema) return;
        
        if (!tema.likes) tema.likes = [];
        const index = tema.likes.indexOf(currentUser);
        if (index === -1) {
            tema.likes.push(currentUser); // Add like
        } else {
            tema.likes.splice(index, 1); // Remove like
        }
        await saveTopic(tema);
        await renderForum(); // Re-render to update counts
    } catch(e) {
        console.error(e);
        alert("Error al actualizar me gusta: " + e.message);
    }
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

async function createTopic(event) {
    event.preventDefault();
    const titulo = document.getElementById('input-titulo').value.trim();
    const contenido = document.getElementById('input-comentario').value.trim();
    if (!titulo || !contenido) return;

    const submitBtn = event.target.querySelector('button[type="submit"]');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Publicando...';
    }

    try {
        const topics = await getTopics();
        const maxId = topics.reduce((max, t) => Math.max(max, t.id), 0);

        const newTema = {
            id: maxId + 1,
            titulo: titulo,
            contenido: contenido,
            autor: currentUser || "Anónimo",
            fecha: new Date().toISOString(),
            responses: []
        };
        await saveTopic(newTema);

        document.getElementById('input-titulo').value = '';
        document.getElementById('input-comentario').value = '';
        await renderForum();
    } catch (error) {
        console.error("Error al crear tema:", error);
        alert("Hubo un error al publicar el tema. Verifica tu conexión y que la base de datos esté configurada. Detalle: " + error.message);
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Publicar';
        }
    }
}

async function sendReply(temaId) {
    const input = document.getElementById('reply-input-' + temaId);
    const txt = input.value.trim();
    if (!txt) return;

    const btn = input.nextElementSibling;
    if (btn) {
        btn.disabled = true;
        btn.textContent = 'Enviando...';
    }

    try {
        const topics = await getTopics();
        const tema = topics.find(t => t.id === temaId);
        if (!tema) return;

        if (!tema.responses) tema.responses = [];
        const maxRespId = tema.responses.reduce((max, r) => Math.max(max, r.id || 0), 0);

        tema.responses.push({
            id: maxRespId + 1,
            autor: currentUser || "Anónimo",
            contenido: txt,
            fecha: new Date().toISOString()
        });
        await saveTopic(tema);

        await renderForum();
        // Re-abrir las respuestas
        setTimeout(() => {
            const respContainer = document.getElementById('responses-' + temaId);
            if (respContainer) respContainer.style.display = 'block';
        }, 50);
    } catch (error) {
        console.error("Error al enviar respuesta:", error);
        alert("Error al enviar respuesta: " + error.message);
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.textContent = 'Responder';
        }
    }
}

// ---- Editar tema ----
async function openEdit(id) {
    editingTopicId = id;
    const topics = await getTopics();
    const tema = topics.find(t => t.id === id);
    if (!tema) return;

    document.getElementById('edit-titulo').value = tema.titulo;
    document.getElementById('edit-contenido').value = tema.contenido;
    document.getElementById('edit-overlay').classList.add('show');
}

function closeEdit() {
    document.getElementById('edit-overlay').classList.remove('show');
}

async function submitEdit() {
    const titulo = document.getElementById('edit-titulo').value.trim();
    const contenido = document.getElementById('edit-contenido').value.trim();
    if (!titulo && !contenido) return;

    try {
        const topics = await getTopics();
        const tema = topics.find(t => t.id === editingTopicId);
        if (!tema || tema.autor !== currentUser) return;

        if (titulo) tema.titulo = titulo;
        if (contenido) tema.contenido = contenido;
        await saveTopic(tema);

        closeEdit();
        await renderForum();
    } catch (error) {
        console.error("Error al editar tema:", error);
        alert("Error al guardar los cambios: " + error.message);
    }
}

// ---- Editar respuesta ----
async function openEditResponse(temaId, respId, btnElement) {
    editingRespTema = temaId;
    editingRespId = respId;

    const topics = await getTopics();
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

async function submitEditResponse() {
    const contenido = document.getElementById('edit-resp-contenido').value.trim();
    if (!contenido) return;

    try {
        const topics = await getTopics();
        const tema = topics.find(t => t.id === editingRespTema);
        if (!tema) return;
        const resp = tema.responses.find(r => r.id === editingRespId);
        if (!resp || resp.autor !== currentUser) return;

        resp.contenido = contenido;
        await saveTopic(tema);
        
        closeEditResponse();
        await renderForum();

        // Re-abrir respuestas
        setTimeout(() => {
            const respContainer = document.getElementById('responses-' + editingRespTema);
            if (respContainer) respContainer.style.display = 'block';
        }, 50);
    } catch (error) {
        console.error("Error al editar respuesta:", error);
        alert("Error al guardar los cambios de la respuesta: " + error.message);
    }
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
            if (currentUser === 'admin@vocacional.com') {
                const adminCard = document.getElementById('admin-card');
                if (adminCard) adminCard.style.display = 'flex';
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

        case 'perfil':
            renderProfile();
            break;

        case 'chat':
            initChat();
            break;

        case 'admin':
            initAdmin();
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

// ============================================================
// PERFIL Y FAVORITOS
// ============================================================
async function renderProfile() {
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }
    document.getElementById('profile-name').textContent = currentUser;
    document.getElementById('profile-email').textContent = currentUser;
    document.getElementById('profile-avatar-letter').textContent = currentUser.charAt(0).toUpperCase();

    const googleData = localStorage.getItem('googleUser');
    if (googleData) {
        try {
            const gUser = JSON.parse(googleData);
            if (gUser.picture) {
                const img = document.getElementById('profile-avatar-img');
                img.src = gUser.picture;
                img.style.display = 'flex';
                document.getElementById('profile-avatar-letter').style.display = 'none';
            }
        } catch(e) {}
    }

    try {
        await loadFirebase();
        let emailId = currentUser.includes('@') ? currentUser : currentUser + "@vocacional.com";
        const userDoc = await firebase.firestore().collection('users').doc(emailId).get();
        const userData = userDoc.data() || {};

        if (userData.lastQuizResult && AREAS[userData.lastQuizResult]) {
            document.getElementById('profile-test-result').textContent = 'Área sugerida: ' + AREAS[userData.lastQuizResult].nombre;
        }

        const favList = document.getElementById('favorites-list');
        favList.innerHTML = '';
        if (userData.favoritos && userData.favoritos.length > 0) {
            userData.favoritos.forEach(fav => {
                favList.innerHTML += `<li>
                    <span>${escapeHtml(fav)}</span>
                    <button class="btn-remove" onclick="toggleFavorite('${fav}', true)">Eliminar</button>
                </li>`;
            });
        } else {
            favList.innerHTML = '<div class="empty-state">Aún no tienes carreras guardadas.</div>';
        }

        const topics = await getTopics();
        const myTopics = topics.filter(t => t.autor === currentUser);
        const postsList = document.getElementById('posts-list');
        postsList.innerHTML = '';
        if (myTopics.length > 0) {
            myTopics.forEach(t => {
                postsList.innerHTML += `<li>
                    <span><strong>${escapeHtml(t.titulo)}</strong> - ${t.fecha.substring(0, 10)}</span>
                    <a href="foro.html" style="color: #2563eb; text-decoration: none; font-weight: 500;">Ver foro</a>
                </li>`;
            });
        } else {
            postsList.innerHTML = '<div class="empty-state">Aún no has publicado nada.</div>';
        }

    } catch (error) {
        console.error("Error cargando perfil", error);
    }
}

async function toggleFavorite(carrera, reloadProfile = false) {
    if (!currentUser) {
        alert("Inicia sesión para guardar favoritos.");
        return;
    }
    try {
        await loadFirebase();
        let emailId = currentUser.includes('@') ? currentUser : currentUser + "@vocacional.com";
        const docRef = firebase.firestore().collection('users').doc(emailId);
        const doc = await docRef.get();
        let favs = [];
        if (doc.exists && doc.data().favoritos) {
            favs = doc.data().favoritos;
        }

        const index = favs.indexOf(carrera);
        if (index === -1) {
            favs.push(carrera);
            if (!reloadProfile) alert("Carrera guardada en favoritos.");
        } else {
            favs.splice(index, 1);
            if (!reloadProfile) alert("Carrera eliminada de favoritos.");
        }

        await docRef.set({ favoritos: favs }, { merge: true });
        
        if (reloadProfile) {
            renderProfile();
        } else {
            const btn = document.getElementById('fav-btn-modal');
            if (btn) btn.textContent = favs.includes(carrera) ? '⭐ Guardada' : '⭐ Guardar en Favoritos';
        }
    } catch(e) {
        console.error(e);
        alert("Error al guardar favorito: " + e.message);
    }
}

// ============================================================
// CHAT GLOBAL
// ============================================================
let chatUnsubscribe = null;

async function initChat() {
    if (!currentUser) return;
    document.getElementById('chat-user').textContent = currentUser;
    const msgContainer = document.getElementById('chat-messages');
    
    try {
        await loadFirebase();
        const db = firebase.firestore();
        chatUnsubscribe = db.collection('messages')
            .orderBy('fecha', 'asc')
            .limit(100)
            .onSnapshot(snapshot => {
                msgContainer.innerHTML = '';
                if (snapshot.empty) {
                    msgContainer.innerHTML = '<div style="text-align: center; color: #94a3b8; margin-top: 20px;">No hay mensajes aún. ¡Sé el primero en saludar!</div>';
                    return;
                }
                snapshot.forEach(doc => {
                    const msg = doc.data();
                    const isSelf = msg.autor === currentUser;
                    const cssClass = isSelf ? 'msg-self' : 'msg-other';
                    msgContainer.innerHTML += `
                        <div class="message ${cssClass}">
                            ${!isSelf ? '<div class="msg-author">' + escapeHtml(msg.autor) + '</div>' : ''}
                            <div>${escapeHtml(msg.contenido)}</div>
                            <div class="msg-time">${new Date(msg.fecha).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                        </div>
                    `;
                });
                msgContainer.scrollTop = msgContainer.scrollHeight;
            }, error => {
                console.error("Chat error", error);
                msgContainer.innerHTML = '<div style="color:red; text-align:center; margin-top:20px;">Error al cargar el chat: Verifica las reglas de Firebase.</div>';
            });
    } catch(e) {
        msgContainer.innerHTML = `<div style="color:red; text-align:center;">Error al inicializar Firebase: ${e.message}</div>`;
    }
}

async function sendChatMessage(event) {
    event.preventDefault();
    const input = document.getElementById('chat-input');
    const txt = input.value.trim();
    if (!txt) return;

    try {
        await loadFirebase();
        await firebase.firestore().collection('messages').add({
            autor: currentUser,
            contenido: txt,
            fecha: new Date().toISOString()
        });
        input.value = '';
    } catch(e) {
        console.error(e);
        alert("No se pudo enviar el mensaje: " + e.message);
    }
}

// ============================================================
// PANEL ADMIN
// ============================================================
async function initAdmin() {
    if (currentUser !== 'admin@vocacional.com') {
        document.getElementById('admin-content').style.display = 'none';
        document.getElementById('admin-error').style.display = 'block';
        return;
    }

    document.getElementById('admin-content').style.display = 'block';
    const tbody = document.getElementById('admin-topics-list');
    
    try {
        const topics = await getTopics();
        const sorted = [...topics].sort((a, b) => b.id - a.id);
        tbody.innerHTML = '';
        if (sorted.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">No hay temas</td></tr>';
            return;
        }

        sorted.forEach(t => {
            tbody.innerHTML += `
                <tr>
                    <td>${t.id}</td>
                    <td><strong>${escapeHtml(t.titulo)}</strong></td>
                    <td>${escapeHtml(t.autor)}</td>
                    <td>${t.fecha.substring(0, 10)}</td>
                    <td><button class="btn-danger" onclick="deleteTopic(${t.id})">Eliminar</button></td>
                </tr>
            `;
        });
    } catch(e) {
        tbody.innerHTML = '<tr><td colspan="5" style="color:red;text-align:center;">Error: ' + e.message + '</td></tr>';
    }
}

async function deleteTopic(id) {
    if (!confirm("¿Estás seguro de eliminar este tema y todas sus respuestas?")) return;
    try {
        await loadFirebase();
        await firebase.firestore().collection('topics').doc(id.toString()).delete();
        alert("Tema eliminado correctamente.");
        initAdmin();
    } catch(e) {
        console.error(e);
        alert("Error al eliminar tema: " + e.message);
    }
}
