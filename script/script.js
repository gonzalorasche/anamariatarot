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