document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.tarot-card');
    
    cards.forEach((card, index) => {
        const isMobile = window.innerWidth < 768;
        const quickLaunchCount = isMobile ? 4 : 3;
        
        // Mantenemos tu ritmo: las primeras salen rápido, el resto con delay
        let delay = index < quickLaunchCount ? index * 100 : index * 400;

        setTimeout(() => {
            lanzarCarta(card);
        }, delay); 
    });
});

function lanzarCarta(card) {
    const hero = document.getElementById('hero');
    const w = hero.offsetWidth;
    const h = hero.offsetHeight;
    
    const isMobile = window.innerWidth < 768;
    const offset = isMobile ? 100 : 350; 

    const ladoEntrada = Math.floor(Math.random() * 4);
    let ladoSalida = Math.floor(Math.random() * 4);
    while (ladoSalida === ladoEntrada) ladoSalida = Math.floor(Math.random() * 4);

    const getCoord = (lado) => {
        switch(lado) {
            case 0: return { x: Math.random() * w, y: -offset };
            case 1: return { x: w + offset, y: Math.random() * h };
            case 2: return { x: Math.random() * w, y: h + offset };
            case 3: return { x: -offset, y: Math.random() * h };
        }
    };

    const inicio = getCoord(ladoEntrada);
    const fin = getCoord(ladoSalida);
    
    const rotIni = Math.random() * 360;
    const rotFin = rotIni + (Math.random() * 240 - 120);

    const duracion = isMobile 
        ? (6000 + Math.random() * 4000) 
        : (12000 + Math.random() * 8000); 

    // ACÁ ESTÁ EL ARREGLO:
    // Eliminamos los "offsets" de opacidad intermedios.
    // La carta nace en 0, pasa inmediatamente a 1 y muere en 0 al final del recorrido.
    const anim = card.animate([
        { transform: `translate(${inicio.x}px, ${inicio.y}px) rotate(${rotIni}deg)`, opacity: 0 },
        { opacity: 1, offset: 0.05 }, // Aparece casi instantáneamente al entrar
        { opacity: 1, offset: 0.95 }, // Se mantiene totalmente sólida hasta el puro borde
        { transform: `translate(${fin.x}px, ${fin.y}px) rotate(${rotFin}deg)`, opacity: 0 }
    ], {
        duration: duracion,
        easing: 'linear'
    });

    anim.onfinish = () => lanzarCarta(card);
}












const DATABASE_PRECIOS = {
    ARS: {
        individual: [{t: "30 Min", p: "$ 27.000"}, {t: "40 Min", p: "$ 33.000"}, {t: "60 Min", p: "$ 43.000"}],
        grupal: [{t: "30 Min", p: "$ 37.800"}, {t: "40 Min", p: "$ 46.200"}, {t: "60 Min", p: "$ 56.000"}],
        numerologia: [{t: "C. Simple", p: "$ 65.000"}, {t: "C. Completa", p: "$ 85.000"}],
        audio: [{t: "1 Pregunta", p: "$ 8.000"}, {t: "2 Preguntas", p: "$ 14.000"}, {t: "3 Preguntas", p: "$ 20.000"}],
        eventos: [{t: "Por Hora", p: "$ 80.000"}]
    },
    USD: {
        individual: [{t: "30 Min", p: "USD 30"}, {t: "40 Min", p: "USD 40"}, {t: "60 Min", p: "USD 50"}],
        numerologia: [{t: "C. Simple", p: "USD 65"}, {t: "C. Completa", p: "USD 85"}],
        audio: [{t: "1 Pregunta", p: "USD 10"}, {t: "2 Preguntas", p: "USD 18"}, {t: "3 Preguntas", p: "USD 25"}]
    },
    EUR: {
        individual: [{t: "30 Min", p: "30 EUR"}, {t: "40 Min", p: "40 EUR"}, {t: "60 Min", p: "50 EUR"}],
        numerologia: [{t: "C. Simple", p: "EUR 65"}, {t: "C. Completa", p: "EUR 85"}],
        audio: [{t: "1 Pregunta", p: "EUR 10"}, {t: "2 Preguntas", p: "EUR 18"}, {t: "3 Preguntas", p: "EUR 25"}]
    }
};

async function initServicios() {
    try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        let region = 'USD';
        if (data.country_code === 'AR') region = 'ARS';
        else if (['ES', 'FR', 'IT', 'DE', 'PT'].includes(data.country_code)) region = 'EUR';
        
        renderizar(region);
    } catch (e) { renderizar('USD'); }
}

function renderizar(reg) {
    const db = DATABASE_PRECIOS[reg];
    
    // Inyectar precios en cada contenedor
    const fill = (id, lista) => {
        const el = document.getElementById(id);
        if(!lista) return;
        el.innerHTML = lista.map(item => `
            <div class="precio-item"><span>${item.t}</span> <strong>${item.p}</strong></div>
        `).join('');
    };

    fill('precios-individual', db.individual);
    fill('precios-grupal', db.grupal);
    fill('precios-numerologia', db.numerologia);
    fill('precios-audio', db.audio);
    fill('precios-eventos', db.eventos);

    // Eliminar tarjetas que no pertenecen a la región
    document.querySelectorAll('.servicio-card[data-region]').forEach(card => {
        if (card.dataset.region !== reg) card.remove();
    });
}

document.addEventListener('DOMContentLoaded', initServicios);