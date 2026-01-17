document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.tarot-card');
    
    cards.forEach((card, index) => {
        // Lanzamos todas casi juntas, con un pequeñísimo delay para que no 
        // se sature el procesador en el milisegundo exacto de carga.
        setTimeout(() => {
            lanzarCarta(card);
        }, index * 400); 
    });
});

function lanzarCarta(card) {
    const hero = document.getElementById('hero');
    const w = hero.offsetWidth;
    const h = hero.offsetHeight;
    const offset = 450; // Margen amplio para que nazcan fuera de la vista

    // Lógica de bordes: 0:arriba, 1:derecha, 2:abajo, 3:izquierda
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
    
    // Rotaciones profundas para efecto místico
    const rotIni = Math.random() * 360;
    const rotFin = rotIni + (Math.random() * 240 - 120);

    // Duraciones variadas para que no parezca un desfile militar, sino un caos natural
    const duracion = 12000 + Math.random() * 15000; 

    // Animación fluida
    const anim = card.animate([
        { transform: `translate(${inicio.x}px, ${inicio.y}px) rotate(${rotIni}deg)`, opacity: 0 },
        { opacity: 1, offset: 0.15 }, // Fade in rápido al entrar
        { opacity: 1, offset: 0.85 }, // Se mantiene sólida
        { transform: `translate(${fin.x}px, ${fin.y}px) rotate(${rotFin}deg)`, opacity: 0 }
    ], {
        duration: duracion,
        easing: 'linear'
    });

    anim.onfinish = () => lanzarCarta(card);
}