import { entityConfirmDeleteButtonSelector } from '../../support/entity';

describe('Shipment e2e test', () => {
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const shipmentSample = { date: '2025-11-30T08:41:00.195Z' };

  let shipment;
  let invoice;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    // create an instance at the required relationship entity:
    cy.authenticatedRequest({
      method: 'POST',
      url: '/services/invoice/api/invoices',
      body: {
        code: 'cram sham',
        date: '2025-11-30T14:07:38.190Z',
        details: 'unfortunate',
        status: 'CANCELLED',
        paymentMethod: 'PAYPAL',
        paymentDate: '2025-11-29T19:55:43.840Z',
        paymentAmount: 26377.94,
      },
    }).then(({ body }) => {
      invoice = body;
    });
  });

  beforeEach(() => {
    cy.intercept('GET', '/services/invoice/api/shipments+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/services/invoice/api/shipments').as('postEntityRequest');
    cy.intercept('DELETE', '/services/invoice/api/shipments/*').as('deleteEntityRequest');
  });

  beforeEach(() => {
    // Simulate relationships api for better performance and reproducibility.
    cy.intercept('GET', '/services/invoice/api/invoices', {
      statusCode: 200,
      body: [invoice],
    });
  });

  afterEach(() => {
    if (shipment) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/services/invoice/api/shipments/${shipment.id}`,
      }).then(() => {
        shipment = undefined;
      });
    }
  });

  afterEach(() => {
    if (invoice) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/services/invoice/api/invoices/${invoice.id}`,
      }).then(() => {
        invoice = undefined;
      });
    }
  });

  it('should list shipments via API through gateway', () => {
    cy.authenticatedRequest({
      method: 'GET',
      url: '/services/invoice/api/shipments',
    }).then(({ status, body }) => {
      expect(status).to.equal(200);
      expect(body).to.be.an('array');
    });
  });

  describe('Shipment API operations through gateway', () => {
    it('should get a specific shipment via API', () => {
      cy.authenticatedRequest({
        method: 'POST',
        url: '/services/invoice/api/shipments',
        body: {
          ...shipmentSample,
          invoice,
        },
      }).then(({ body }) => {
        shipment = body;

        cy.authenticatedRequest({
          method: 'GET',
          url: `/services/invoice/api/shipments/${shipment.id}`,
        }).then(({ status, body: fetchedShipment }) => {
          expect(status).to.equal(200);
          expect(fetchedShipment.id).to.equal(shipment.id);
          expect(fetchedShipment.date).to.exist;
        });
      });
    });

    it('should update a shipment via API', () => {
      cy.authenticatedRequest({
        method: 'POST',
        url: '/services/invoice/api/shipments',
        body: {
          ...shipmentSample,
          invoice,
        },
      }).then(({ body }) => {
        shipment = body;

        const updatedShipment = {
          ...shipment,
          trackingCode: 'UPDATED-CODE-123',
          details: 'Updated shipment details',
        };

        cy.authenticatedRequest({
          method: 'PUT',
          url: `/services/invoice/api/shipments/${shipment.id}`,
          body: updatedShipment,
        }).then(({ status, body: updated }) => {
          expect(status).to.equal(200);
          expect(updated.trackingCode).to.equal('UPDATED-CODE-123');
          expect(updated.details).to.equal('Updated shipment details');
        });
      });
    });

    it('should delete a shipment via API', () => {
      cy.authenticatedRequest({
        method: 'POST',
        url: '/services/invoice/api/shipments',
        body: {
          ...shipmentSample,
          invoice,
        },
      }).then(({ body }) => {
        const tempShipment = body;

        cy.authenticatedRequest({
          method: 'DELETE',
          url: `/services/invoice/api/shipments/${tempShipment.id}`,
        }).then(({ status }) => {
          expect(status).to.equal(204);
        });
      });
    });
  });

  describe('Shipment creation via API', () => {
    it('should create a new shipment via API', () => {
      const newShipment = {
        trackingCode: 'TEST-TRACKING-CODE',
        date: '2025-11-30T05:50:00.000Z',
        details: 'Test shipment details',
        invoice,
      };

      cy.authenticatedRequest({
        method: 'POST',
        url: '/services/invoice/api/shipments',
        body: newShipment,
      }).then(({ status, body }) => {
        expect(status).to.equal(201);
        expect(body.trackingCode).to.equal('TEST-TRACKING-CODE');
        expect(body.details).to.equal('Test shipment details');
        expect(body.id).to.exist;
        shipment = body;
      });
    });
  });
});
