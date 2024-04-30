// Función para calcular el pago mensual del crédito
function calcularPagoMensual() {
    // Capturar entradas mediante prompt()
    const montoCredito = parseFloat(prompt("Ingrese el monto del crédito:"));
    const tasaInteres = parseFloat(prompt("Ingrese la tasa de interés (% mensual):"));
    const plazoMeses = parseInt(prompt("Ingrese el plazo en meses:"));

    // Validar que los valores ingresados sean válidos
    if (isNaN(montoCredito) || isNaN(tasaInteres) || isNaN(plazoMeses) || montoCredito <= 0 || tasaInteres <= 0 || plazoMeses <= 0) {
        alert('Por favor ingrese valores válidos en todos los campos.');
        return;
    }

    // Calcular el pago mensual del crédito
    const interesMensual = tasaInteres / 100;
    const cuotaFija = (montoCredito * interesMensual) / (1 - Math.pow(1 + interesMensual, -plazoMeses));

    // Efectuar una salida del resultado utilizando alert()
    const mensaje = "Pago mensual del crédito: $" + cuotaFija.toFixed(2);
    alert(mensaje);
}

// Llamar a la función para calcular el pago mensual del crédito
calcularPagoMensual();