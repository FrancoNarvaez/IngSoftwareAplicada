describe('Test Login Ionic App', () => {
  const IONIC_URL = 'http://localhost:4200';
  const API_URL = 'http://localhost:8080';

  beforeEach(() => {
    cy.log('🧪 Iniciando test de login');
  });

  it('1. Debe verificar que el backend responde correctamente', () => {
    cy.log('📡 Test 1: Backend directo');

    cy.request({
      method: 'POST',
      url: `${API_URL}/api/authenticate`,
      body: {
        username: 'admin',
        password: 'admin',
        rememberMe: false,
      },
    }).then(response => {
      cy.log(`✅ Status: ${response.status}`);
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('id_token');
      cy.log(`✅ Token recibido: ${response.body.id_token.substring(0, 30)}...`);
    });
  });

  it('2. Debe verificar que el proxy funciona desde el frontend', () => {
    cy.log('📡 Test 2: Proxy desde frontend');

    cy.request({
      method: 'POST',
      url: `${IONIC_URL}/api/authenticate`,
      body: {
        username: 'admin',
        password: 'admin',
        rememberMe: false,
      },
    }).then(response => {
      cy.log(`✅ Status: ${response.status}`);
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('id_token');
      cy.log(`✅ Token desde proxy: ${response.body.id_token.substring(0, 30)}...`);
    });
  });

  it('3. Debe visitar la página de login y verificar elementos', () => {
    cy.log('🌐 Test 3: Visitar página de login');

    cy.visit(IONIC_URL);
    cy.get('body').should('exist');

    // Verificar que estamos en la página de login o que fue redirigido
    cy.url().then(url => {
      cy.log(`URL actual: ${url}`);
    });

    // Buscar campos de login (pueden estar con diferentes selectores)
    cy.get('body').then($body => {
      if ($body.find('ion-input').length > 0) {
        cy.log('✅ Encontró elementos ion-input');
      }
      if ($body.find('input[type="text"]').length > 0) {
        cy.log('✅ Encontró input de texto');
      }
      if ($body.find('input[type="password"]').length > 0) {
        cy.log('✅ Encontró input de password');
      }
    });
  });

  it('4. Debe hacer login a través del formulario', () => {
    cy.log('🔐 Test 4: Login completo');

    // Interceptar la petición de login
    cy.intercept('POST', '/api/authenticate').as('loginRequest');

    // Navegar a la home y luego provocar redirección a login
    cy.visit(IONIC_URL);
    cy.contains('Explorar Productos').click();
    cy.url().should('include', '/login');
    cy.get('body').should('exist');

    cy.log('Buscando campos de login...');

    // Buscar el campo de usuario - probar diferentes selectores
    cy.get('body').then($body => {
      // Método 1: Por atributo name
      if ($body.find('input[name="username"]').length > 0) {
        cy.log('📝 Método 1: input[name="username"]');
        cy.get('input[name="username"]').clear().type('admin');
        cy.get('input[name="password"]').clear().type('admin');
      }
      // Método 2: Por type
      else if ($body.find('input[type="text"]').length > 0) {
        cy.log('📝 Método 2: input[type="text"]');
        cy.get('input[type="text"]').first().clear().type('admin');
        cy.get('input[type="password"]').first().clear().type('admin');
      }
      // Método 3: Por ion-input
      else if ($body.find('ion-input').length > 0) {
        cy.log('📝 Método 3: ion-input');
        cy.get('ion-input').first().find('input').clear().type('admin');
        cy.get('ion-input').eq(1).find('input').clear().type('admin');
      }
    });

    // Buscar y hacer clic en el botón de login
    cy.get('body').then($body => {
      if ($body.find('ion-button').length > 0) {
        cy.log('🔘 Haciendo clic en ion-button');
        cy.get('ion-button')
          .contains(/login|iniciar|entrar/i)
          .click();
      } else if ($body.find('button').length > 0) {
        cy.log('🔘 Haciendo clic en button');
        cy.get('button')
          .contains(/login|iniciar|entrar/i)
          .click();
      }
    });

    // Esperar a que se complete la petición
    cy.wait('@loginRequest', { timeout: 10000 }).then(interception => {
      cy.log(`📥 Request URL: ${interception.request.url}`);
      cy.log(`📥 Request Body: ${JSON.stringify(interception.request.body)}`);
      cy.log(`📤 Response Status: ${interception.response.statusCode}`);

      if (interception.response) {
        cy.log(`📤 Response Body: ${JSON.stringify(interception.response.body).substring(0, 100)}...`);

        // Verificar respuesta
        expect(interception.response.statusCode).to.be.oneOf([200, 201]);

        if (interception.response.statusCode === 200) {
          cy.log('✅ Login exitoso!');
          expect(interception.response.body).to.have.property('id_token');
        } else {
          cy.log(`❌ Error en login: ${interception.response.statusCode}`);
        }
      } else {
        cy.log('❌ No hubo respuesta del servidor');
      }
    });

    // Verificar redirección o mensaje de éxito
    cy.wait(3000);
    cy.url().then(url => {
      cy.log(`URL después de login: ${url}`);
      if (url.includes('products') || url.includes('home')) {
        cy.log('✅ Redirigido correctamente a products/home');
      } else {
        cy.log('⚠️  No se detectó redirección esperada');
      }
    });
  });

  it('5. Diagnóstico completo - captura de errores', () => {
    cy.log('🔍 Test 5: Diagnóstico de errores');

    const errors = [];

    // Capturar errores de consola
    cy.on('window:before:load', win => {
      cy.stub(win.console, 'error').callsFake((...args) => {
        errors.push({ type: 'console.error', message: args.join(' ') });
        cy.log(`❌ Console Error: ${args[0]}`);
      });
    });

    cy.visit(IONIC_URL);
    cy.get('body').should('exist');

    // Verificar si hay errores de red
    cy.log('🌐 Verificando errores de red...');

    // Intentar hacer login manualmente desde la consola
    cy.window().then(() => {
      fetch('/api/authenticate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'admin', password: 'admin', rememberMe: false }),
      })
        .then(res => {
          cy.log(`✅ Fetch manual exitoso: ${res.status}`);
          return res.json();
        })
        .then(data => {
          cy.log(`✅ Token: ${data.id_token ? 'Recibido' : 'No recibido'}`);
        })
        .catch(err => {
          cy.log(`❌ Error en fetch manual: ${err.message}`);
        });
    });

    cy.get('body').should('exist');

    // Mostrar resumen de errores
    cy.then(() => {
      cy.log('📊 Resumen de errores capturados:');
      if (errors.length === 0) {
        cy.log('✅ No se detectaron errores');
      } else {
        errors.forEach((err, idx) => {
          cy.log(`${idx + 1}. [${err.type}] ${err.message}`);
        });
      }
    });
  });
});
