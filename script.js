let fields = [
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null
];

function init() {
    render();
}

function render() {
    const contentDiv = document.getElementById('content');
    let tableHtml = '<table>';

    for (let i = 0; i < 3; i++) {
        tableHtml += '<tr>';

        for (let j = 0; j < 3; j++) {
            const index = i * 3 + j;
            tableHtml += `<td onclick="handleClick(${index})" class="${fields[index]}">`;

            if (fields[index] === 'circle') {
                tableHtml += generateAnimatedCircle();
            } else if (fields[index] === 'cross') {
                tableHtml += generateAnimatedCross();
            }

            tableHtml += '</td>';
        }

        tableHtml += '</tr>';
    }

    tableHtml += '</table>';
    contentDiv.innerHTML = tableHtml;

    // Überprüfe den Spielstatus nach jedem Rendern
    checkGameStatus();
}


function generateAnimatedCircle() {
    const svgCode = `
    <svg width="70" height="70" xmlns="http://www.w3.org/2000/svg">
    <circle cx="35" cy="35" r="30" fill="transparent" stroke="#00B0EF" stroke-width="5">
      <animate attributeName="stroke-dasharray" values="0 188; 188 0" dur="200ms" repeatCount="1" keyTimes="0;1" />
    </circle>
  </svg>
    `;

    return svgCode;
}


function generateAnimatedCross() {
    const svgCode = `
      <svg width="70" height="70" xmlns="http://www.w3.org/2000/svg">
        <line x1="10" y1="10" x2="60" y2="60" stroke="#FFC000" stroke-width="10">
          <animate attributeName="stroke-dasharray" values="0 74; 74 0" dur="200ms" repeatCount="1" keyTimes="0;1" />
        </line>
        <line x1="60" y1="10" x2="10" y2="60" stroke="#FFC000" stroke-width="10">
          <animate attributeName="stroke-dasharray" values="0 74; 74 0" dur="200ms" repeatCount="1" keyTimes="0;1" />
        </line>
      </svg>
    `;

    return svgCode;
}


function handleClick(index) {
    const contentDiv = document.getElementById('content');
    const tdElement = contentDiv.querySelectorAll('td')[index];

    if (fields[index] === null) {
        // Abwechselnd "circle" oder "cross" hinzufügen
        fields[index] = (fields.filter(value => value === 'circle').length <= fields.filter(value => value === 'cross').length) ? 'circle' : 'cross';

        // HTML-Code mit Animation einfügen
        tdElement.innerHTML = (fields[index] === 'circle') ? generateAnimatedCircle() : generateAnimatedCross();

        // onclick-Funktion entfernen
        tdElement.onclick = null;

        // Überprüfe den Spielstatus nach jedem Zug
        checkGameStatus();
    }
}


function checkGameStatus() {
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Horizontale Linien
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Vertikale Linien
        [0, 4, 8], [2, 4, 6]             // Diagonale Linien
    ];

    for (const combination of winningCombinations) {
        const [a, b, c] = combination;

        if (fields[a] && fields[a] === fields[b] && fields[a] === fields[c]) {
            // Gewinnkombination gefunden
            drawWinningLine(combination);
            return;
        }
    }

    // Überprüfe auf Unentschieden
    if (!fields.includes(null)) {
        alert("Unentschieden!");
    }
}

function drawWinningLine(combination) {
    const contentDiv = document.getElementById('content');

    // Berechne die Mittelpunkte der beteiligten Zellen
    const points = combination.map(index => {
        const cell = contentDiv.querySelectorAll('td')[index];
        const rect = cell.getBoundingClientRect();
        return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2};
    });

    // Füge eine Linie ein, die die Punkte verbindet
    const svgLine = `<svg width="200%" height="100%" xmlns="http://www.w3.org/2000/svg" style="position: absolute; top: 0; left: 0;">
                        <line x1="${points[0].x}" y1="${points[0].y}" x2="${points[2].x}" y2="${points[2].y}" stroke="white" stroke-width="5" />
                    </svg>`;

    contentDiv.insertAdjacentHTML('beforeend', svgLine);
}


function restartGame() {
    // Setze das Spielfeld zurück
    fields = [
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null
    ];

    // Rufe die render-Funktion auf, um das Spielfeld neu zu zeichnen
    render();
}