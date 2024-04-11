document.addEventListener("DOMContentLoaded", function() {
    // Función para calcular el pago mensual del crédito
    function calcularPagoMensual() {
        var montoCredito = parseFloat(document.getElementById('loanAmount').value);
        var tasaInteres = parseFloat(document.getElementById('interestRate').value);
        var plazoMeses = parseInt(document.getElementById('loanTerm').value);

        // Validar que los campos no estén vacíos y que los valores sean válidos
        if (isNaN(montoCredito) || isNaN(tasaInteres) || isNaN(plazoMeses) || montoCredito <= 0 || tasaInteres <= 0 || plazoMeses <= 0) {
            alert('Por favor ingrese valores válidos en todos los campos.');
            return;
        }

        var interesMensual = tasaInteres / 100;
        var cuotaFija = (montoCredito * interesMensual) / (1 - Math.pow(1 + interesMensual, -plazoMeses));

        var resultadoDiv = document.getElementById('result');
        resultadoDiv.innerHTML = '';
        resultadoDiv.innerHTML += '<h2>Resultado:</h2>';
        resultadoDiv.innerHTML += '<p>Pago mensual del crédito: $' + cuotaFija.toFixed(2) + '</p>';
    }

    // Agregar evento click al botón de calcular
    var calculateBtn = document.getElementById('calculateBtn');
    calculateBtn.addEventListener('click', calcularPagoMensual);
});
