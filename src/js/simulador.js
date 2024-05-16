// Definir un objeto para el crédito
const credito = {
    monto: null,
    tasaInteres: null,
    plazo: null,
    calcularCuotaFija: function() {
        // Calcular el pago mensual del crédito
        const interesMensual = this.tasaInteres / 100;
        const cuotaFija = (this.monto * interesMensual) / (1 - Math.pow(1 + interesMensual, -this.plazo));
        return cuotaFija.toFixed(2);
    },
    validarDatos: function() {
        // Validar que los valores ingresados sean válidos
        if (isNaN(this.monto) || isNaN(this.tasaInteres) || isNaN(this.plazo) || this.monto <= 0 || this.tasaInteres <= 0 || this.plazo <= 0) {
            return false;
        }
        return true;
    }
};

// Capturar entradas mediante prompt() y asignarlas al objeto credito
credito.monto = parseFloat(prompt("Ingrese el monto del crédito:"));
credito.tasaInteres = parseFloat(prompt("Ingrese la tasa de interés (% mensual):"));
credito.plazo = parseInt(prompt("Ingrese el plazo en meses:"));

// Validar los datos ingresados
if (!credito.validarDatos()) {
    alert('Por favor ingrese valores válidos en todos los campos.');
} else {
    // Calcular y mostrar el resultado
    const cuotaFija = credito.calcularCuotaFija();
    const mensaje = "Pago mensual del crédito: $" + cuotaFija;
    alert(mensaje);
}
