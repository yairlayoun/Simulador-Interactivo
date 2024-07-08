document.addEventListener("DOMContentLoaded", function() {
    const creditForm = document.getElementById('creditForm');
    const resultDiv = document.getElementById('result');
    const paymentResultDiv = document.getElementById('paymentResult');
    const paymentChart = document.getElementById('paymentChart').getContext('2d');
    const interestRateOptions = document.getElementById('interestRateOptions');

    // Cargar datos del crédito desde el Local Storage al cargar la página
    cargarDatos();

    // Cargar tasas de interés desde JSON
    cargarTasas();

    // Manejar evento submit del formulario
    creditForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Evitar el envío del formulario

        // Capturar valores de entrada
        const montoCredito = parseFloat(document.getElementById('loanAmount').value);
        const tasaInteresSeleccionada = interestRateOptions.value;
        const tasaInteres = tasaInteresSeleccionada ? parseFloat(tasaInteresSeleccionada) : parseFloat(document.getElementById('interestRate').value);
        const plazoMeses = parseInt(document.getElementById('loanTerm').value);

        // Validar datos ingresados
        if (isNaN(montoCredito) || isNaN(tasaInteres) || isNaN(plazoMeses) || montoCredito <= 0 || tasaInteres <= 0 || plazoMeses <= 0) {
            resultDiv.innerHTML = '<p>Por favor ingrese valores válidos en todos los campos.</p>';
            return;
        }

        // Guardar datos del crédito en el Local Storage
        const credito = {
            monto: montoCredito,
            tasaInteres: tasaInteres,
            plazo: plazoMeses
        };
        localStorage.setItem('credito', JSON.stringify(credito));

        // Calcular y mostrar el resultado
        const cuotaFija = calcularCuotaFija(montoCredito, tasaInteres, plazoMeses);
        mostrarResultado(cuotaFija);
        graficarPagos(montoCredito, tasaInteres, plazoMeses, cuotaFija);
    });

    // Función para cargar datos del crédito desde el Local Storage
    function cargarDatos() {
        const creditoGuardado = localStorage.getItem('credito');
        if (creditoGuardado) {
            const credito = JSON.parse(creditoGuardado);
            document.getElementById('loanAmount').value = credito.monto;
            document.getElementById('interestRate').value = credito.tasaInteres;
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
        paymentResultDiv.innerHTML = '';
        paymentResultDiv.innerHTML += '<h2>Resultado:</h2>';
        paymentResultDiv.innerHTML += '<p>Pago mensual del crédito: $' + cuotaFija + '</p>';
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

        new Chart(paymentChart, {
            type: 'line',
            data: {
                labels: Array.from({ length: plazo + 1 }, (_, i) => i),
                datasets: [{
                    label: 'Saldo pendiente',
                    data: saldos,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
});
