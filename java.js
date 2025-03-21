document.addEventListener('DOMContentLoaded', function() {
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            const rekordDiv = document.getElementById('rekord');
            const terminarzDiv = document.getElementById('terminarz');
            const timerDiv = document.getElementById('timer');
            const showFullScheduleButton = document.getElementById('show-full-schedule');

            // Wyświetl rekord jako W i L
            rekordDiv.innerHTML = `
        <span class="wygrana">W: ${data.rekord.wygrane}</span> 
        <span class="przegrana">L: ${data.rekord.przegrane}</span>
      `;

            // Filtruj mecze z wynikiem różnym od 0 - 0
            const meczeRozegrane = data.terminarz.filter(mecz => mecz.wynik !== "0 - 0");

            // Filtruj mecze z wynikiem 0 - 0
            const meczeNierozegrane = data.terminarz.filter(mecz => mecz.wynik === "0 - 0");

            // Pobierz ostatnich 5 rozegranych meczów
            const ostatnich5Rozegranych = meczeRozegrane.slice(-5).reverse();

            // Pobierz pierwszych 5 nierozegranych meczów
            const pierwszych5Nierozegranych = meczeNierozegrane.slice(0, 5);

            // Funkcja do tworzenia tabeli
            function utworzTabele(mecze, naglowek) {
                const tabela = document.createElement('table');
                tabela.classList.add('tabela-meczy');

                const naglowekTabeli = document.createElement('h3');
                naglowekTabeli.innerText = naglowek;
                terminarzDiv.appendChild(naglowekTabeli);

                const thead = document.createElement('thead');
                const trHead = document.createElement('tr');
                trHead.innerHTML = `<th>Przeciwnik</th><th>Wynik</th><th>Rezultat</th>`;
                thead.appendChild(trHead);
                tabela.appendChild(thead);

                const tbody = document.createElement('tbody');

                mecze.forEach(mecz => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
            <td>${mecz.przeciwnik} <img src="${mecz.logoPrzeciwnika}" alt="${mecz.przeciwnik}" width="20"></td>
            <td>${mecz.wynik}</td>
            <td class="${mecz.rezultat === 'W' ? 'wygrana' : 'przegrana'}">${mecz.rezultat}</td>
          `;
                    tbody.appendChild(tr);
                });

                tabela.appendChild(tbody);
                terminarzDiv.appendChild(tabela);
            }

            // Utwórz tabele
            utworzTabele(ostatnich5Rozegranych, "Ostatnie 5 ");
            utworzTabele(pierwszych5Nierozegranych, "Koljene 5 ");

            // Funkcja do odliczania czasu
            function odliczCzas(doKiedy) {
                const teraz = new Date().getTime();
                const roznica = doKiedy - teraz;

                if (roznica < 0) {
                    timerDiv.innerText = "Czas minął!";
                    return;
                }

                const dni = Math.floor(roznica / (1000 * 60 * 60 * 24));
                const godziny = Math.floor((roznica % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minuty = Math.floor((roznica % (1000 * 60 * 60)) / (1000 * 60));
                const sekundy = Math.floor((roznica % (1000 * 60)) / 1000);

                timerDiv.innerHTML = `
          ${dni.toString().padStart(2, '0')} dni : 
          ${godziny.toString().padStart(2, '0')} godzin : 
          ${minuty.toString().padStart(2, '0')} minut : 
          ${sekundy.toString().padStart(2, '0')} sekund
        `;

                setTimeout(() => odliczCzas(doKiedy), 1000);
            }

            const dataDoOdliczania = new Date('2025-04-19T00:00:00').getTime();
            odliczCzas(dataDoOdliczania);

            // Funkcja do pokazywania pełnego terminarza
            function pokazPelnegoTerminarza() {
                const tabelaPełnegoTerminarzu = document.createElement('table');
                tabelaPełnegoTerminarzu.classList.add('tabela-meczy');

                const naglowekTabeli = document.createElement('h3');
                naglowekTabeli.innerText = "Pełny Terminarz";
                terminarzDiv.appendChild(naglowekTabeli);

                const thead = document.createElement('thead');
                const trHead = document.createElement('tr');
                trHead.innerHTML = `<th>Przeciwnik</th><th>Wynik</th><th>Rezultat</th>`;
                thead.appendChild(trHead);
                tabelaPełnegoTerminarzu.appendChild(thead);

                const tbody = document.createElement('tbody');

                data.terminarz.forEach(mecz => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
            <td>${mecz.przeciwnik} <img src="${mecz.logoPrzeciwnika}" alt="${mecz.przeciwnik}" width="20"></td>
            <td>${mecz.wynik}</td>
            <td class="${mecz.rezultat === 'W' ? 'wygrana' : 'przegrana'}">${mecz.rezultat}</td>
          `;
                    tbody.appendChild(tr);
                });

                tabelaPełnegoTerminarzu.appendChild(tbody);
                terminarzDiv.appendChild(tabelaPełnegoTerminarzu);
            }

            // Obsługa przycisku
            let isFullScheduleShown = false;
            showFullScheduleButton.addEventListener('click', () => {
                if (!isFullScheduleShown) {
                    pokazPelnegoTerminarza();
                    showFullScheduleButton.innerText = "Schowaj Pełny Terminarz";
                    isFullScheduleShown = true;
                } else {
                    const tabelaPełnegoTerminarzu = document.querySelector('.tabela-meczy:last-child');
                    tabelaPełnegoTerminarzu.remove();
                    showFullScheduleButton.innerText = "Pokaż Cały Terminarz";
                    isFullScheduleShown = false;
                }
            });
        })
        .catch(error => console.error('Błąd:', error));
});
