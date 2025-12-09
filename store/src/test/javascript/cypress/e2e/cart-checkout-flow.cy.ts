describe('Flujo Completo de Compra', () => {
  const IONIC_URL = 'http://localhost:4200';

  beforeEach(() => {
    // Limpiar estado antes de cada test si es necesario
    cy.visit(IONIC_URL);
  });

  it('Debe realizar una compra completa y verificar que el carrito se vacíe', () => {
    // 1. Iniciar Sesión
    cy.log('🔐 Iniciando sesión...');
    cy.visit(`${IONIC_URL}/login`);
    cy.get('ion-input[name="username"] input').type('admin');
    cy.get('ion-input[name="password"] input').type('admin');
    cy.get('ion-button[type="submit"]').click();

    // Esperar a que redirija a productos (comportamiento por defecto del login)
    cy.url().should('include', '/products');
    cy.contains('Productos').should('be.visible');

    // 2. Agregar 3 items (ya estamos en la página de productos)
    cy.log('🛍️ Agregando productos...');
    // cy.visit(`${IONIC_URL}/products`); // No es necesario si ya estamos ahí

    // Esperar a que carguen los productos
    cy.get('app-product-card').should('have.length.at.least', 3);

    // Agregar 3 productos diferentes
    cy.get('app-product-card').eq(0).find('ion-button.add-to-cart-btn').click();
    cy.wait(500); // Pequeña espera para asegurar que se procese
    cy.get('app-product-card').eq(1).find('ion-button.add-to-cart-btn').click();
    cy.wait(500);
    cy.get('app-product-card').eq(2).find('ion-button.add-to-cart-btn').click();
    cy.wait(500);

    // Verificar badge del carrito
    cy.get('ion-button[routerLink="/cart"] ion-badge').should('contain', '3');

    // 3. Ir al Carrito
    cy.log('🛒 Yendo al carrito...');
    cy.get('ion-button[routerLink="/cart"]').click();
    cy.url().should('include', '/cart');

    // Verificar que hay 3 items en la lista
    cy.get('ion-item.cart-item').should('have.length', 3);

    // 4. Proceder al Checkout (Paso 1 -> 2)
    cy.contains('Proceder al Checkout').click();

    // 5. Completar Envío (Paso 2 -> 3)
    cy.log('🚚 Completando envío...');
    cy.contains('Información de Envío').should('be.visible');

    // Llenar formulario de envío
    cy.get('ion-input[name="firstName"] input').clear().type('Juan');
    cy.get('ion-input[name="lastName"] input').clear().type('Perez');
    cy.get('ion-input[name="email"] input').clear().type('juan.perez@test.com');
    cy.get('ion-input[name="phone"] input').clear().type('1122334455');
    cy.get('ion-input[name="address"] input').clear().type('Calle Falsa 123');
    cy.get('ion-input[name="city"] input').clear().type('Springfield');
    cy.get('ion-input[name="state"] input').clear().type('Estado');

    // Seleccionar envío estándar (debería estar seleccionado por defecto, pero verificamos)
    cy.contains('Envío Estándar').click();

    cy.contains('Continuar al Pago').click();

    // 6. Completar Pago (Paso 3 -> 4)
    cy.log('💳 Completando pago...');
    cy.contains('Información de Pago').should('be.visible');

    cy.get('ion-input[name="cardHolder"] input').type('JUAN PEREZ');
    cy.get('ion-input[name="cardNumber"] input').type('1234567890123456');
    cy.get('ion-input[name="expiryDate"] input').type('12/25');
    cy.get('ion-input[name="cvv"] input').type('123');

    // Verificar resumen antes de confirmar
    cy.get('.total-row .total-amount').should('not.contain', '$0,00');

    cy.contains('Confirmar Pago').click();

    // 7. Verificar Confirmación
    cy.log('✅ Verificando confirmación...');
    cy.contains('¡Pedido Confirmado!', { timeout: 10000 }).should('be.visible');

    // Verificar que aparecen los items en la confirmación
    cy.get('.confirmation-items ion-item').should('have.length', 3);

    // Verificar que el total no es cero
    cy.get('.final-total .amount').should('not.contain', '$0,00');

    // 8. Verificar que el carrito se vació al salir
    cy.log('🧹 Verificando limpieza del carrito...');
    cy.contains('Volver a Tienda').click();

    // Debería volver a productos
    cy.url().should('include', '/products');

    // El badge del carrito NO debería existir o debería ser 0 (dependiendo de la implementación, usamos *ngIf > 0 así que no debería existir)
    cy.get('ion-button[routerLink="/cart"] ion-badge').should('not.exist');
  });
});
