document.addEventListener("DOMContentLoaded", function() {
    const creditForm = document.getElementById('creditForm');
    const resultDiv = document.getElementById('result');
    const paymentResultDiv = document.getElementById('paymentResult');
    const paymentChartCtx = document.getElementById('paymentChart').getContext('2d');
    const interestRateOptions = document.getElementById('interestRateOptions');
    const historialDiv = document.createElement('div');
    let chartInstance;

    // Añadir historial de simulaciones
    document.querySelector('.container').appendChild(historialDiv);

    // Cargar datos del crédito desde el Local Storage al cargar la página
    cargarDatos();
    mostrarHistorial();

    // Cargar tasas de interés desde JSON
    cargarTasas();

    // Manejar evento submit del formulario
    creditForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Evitar el envío del formulario

        // Capturar valores de entrada
        const montoCredito = parseFloat(document.getElementById('loanAmount').value);
        const tasaInteresSeleccionada = parseFloat(interestRateOptions.value);
        const plazoMeses = parseInt(document.getElementById('loanTerm').value);

        // Validar datos ingresados
        if (isNaN(montoCredito) || isNaN(tasaInteresSeleccionada) || isNaN(plazoMeses) || montoCredito <= 0 || tasaInteresSeleccionada <= 0 || plazoMeses < 1) {
            resultDiv.innerHTML = '<div class="alert alert-danger">Por favor ingrese valores válidos en todos los campos. El monto y la tasa deben ser mayores a 0 y el plazo debe ser al menos 1 mes.</div>';
            return;
        }

        // Guardar datos del crédito en el Local Storage
        const credito = {
            monto: montoCredito,
            tasaInteres: tasaInteresSeleccionada,
            plazo: plazoMeses
        };
        guardarEnHistorial(credito);

        // Calcular y mostrar el resultado
        const cuotaFija = calcularCuotaFija(montoCredito, tasaInteresSeleccionada, plazoMeses);
        mostrarResultado(cuotaFija);
        graficarPagos(montoCredito, tasaInteresSeleccionada, plazoMeses, cuotaFija);
    });

    // Función para cargar datos del crédito desde el Local Storage
    function cargarDatos() {
        const creditoGuardado = localStorage.getItem('credito');
        if (creditoGuardado) {
            const credito = JSON.parse(creditoGuardado);
            document.getElementById('loanAmount').value = credito.monto;
            document.getElementById('loanTerm').value = credito.plazo;
        }
    }

    // Función para cargar tasas de interés desde un archivo JSON
    function cargarTasas() {
        fetch('src/json/tasas.json')
            .then(response => response.json())
            .then(data => {
                const tasas = data.tasas;
                tasas.forEach(tasa => {
                    const option = document.createElement('option');
                    option.value = tasa.valor;
                    option.text = `${tasa.nombre} - ${tasa.valor}%`;
                    interestRateOptions.appendChild(option);
                });
            })
            .catch(error => console.error('Error cargando tasas:', error));
    }

    // Función para calcular la cuota fija del crédito
    function calcularCuotaFija(monto, tasaInteres, plazo) {
        const interesMensual = tasaInteres / 100;
        const cuotaFija = (monto * interesMensual) / (1 - Math.pow(1 + interesMensual, -plazo));
        return cuotaFija.toFixed(2);
    }

    // Función para mostrar el resultado en el DOM
    function mostrarResultado(cuotaFija) {
        paymentResultDiv.innerHTML = `
            <h2>Resultado:</h2>
            <p>Pago mensual del crédito: $${cuotaFija}</p>
        `;
        // Animar la aparición del resultado
        $(paymentResultDiv).hide().fadeIn(1000);
    }

    // Función para graficar los pagos mensuales usando Chart.js
    function graficarPagos(monto, tasaInteres, plazo, cuotaFija) {
        const interesMensual = tasaInteres / 100;
        let saldo = monto;
        const saldos = [saldo];

        for (let i = 0; i < plazo; i++) {
            const interes = saldo * interesMensual;
            const principal = cuotaFija - interes;
            saldo -= principal;
            saldos.push(saldo);
        }

        // Si ya existe una gráfica, destruirla antes de crear una nueva
        if (chartInstance) {
            chartInstance.destroy();
        }

        chartInstance = new Chart(paymentChartCtx, {
            type: 'line',
            data: {
                labels: Array.from({ length: plazo + 1 }, (_, i) => i),
                datasets: [{
                    label: 'Saldo pendiente',
                    data: saldos,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                    pointHoverRadius: 7
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                plugins: {
                    tooltip: {
                        enabled: true
                    }
                }
            }
        });
    }

    // Función para guardar en historial
    function guardarEnHistorial(credito) {
        let historial = JSON.parse(localStorage.getItem('historial')) || [];
        historial.push(credito);
        localStorage.setItem('historial', JSON.stringify(historial));
        mostrarHistorial();
    }

    // Función para mostrar el historial en el DOM
    function mostrarHistorial() {
        const historial = JSON.parse(localStorage.getItem('historial')) || [];
        historialDiv.innerHTML = '<h3>Historial de Simulaciones:</h3>';
        historial.forEach((credito, index) => {
            historialDiv.innerHTML += `
                <p>Simulación ${index + 1}: Monto: $${credito.monto}, Tasa: ${credito.tasaInteres}%, Plazo: ${credito.plazo} meses</p>
            `;
        });
    }
});
