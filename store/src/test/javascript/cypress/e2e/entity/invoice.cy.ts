describe('Invoice e2e test', () => {
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const invoiceSample = {
    code: 'TEST-INVOICE-001',
    date: '2025-11-30T02:19:15.201Z',
    status: 'PAID',
    paymentMethod: 'CASH_ON_DELIVERY',
    paymentDate: '2025-11-30T15:13:40.707Z',
    paymentAmount: 6147.24,
  };

  let invoice;

  beforeEach(() => {
    cy.login(username, password);
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

  it('should list invoices via API through gateway', () => {
    cy.authenticatedRequest({
      method: 'GET',
      url: '/services/invoice/api/invoices',
    }).then(({ status, body }) => {
      expect(status).to.equal(200);
      expect(body).to.be.an('array');
    });
  });

  describe('Invoice API operations through gateway', () => {
    it('should create a new invoice via API', () => {
      cy.authenticatedRequest({
        method: 'POST',
        url: '/services/invoice/api/invoices',
        body: invoiceSample,
      }).then(({ status, body }) => {
        expect(status).to.equal(201);
        expect(body.code).to.equal('TEST-INVOICE-001');
        expect(body.status).to.equal('PAID');
        expect(body.paymentAmount).to.equal(6147.24);
        expect(body.id).to.exist;
        invoice = body;
      });
    });

    it('should get a specific invoice via API', () => {
      cy.authenticatedRequest({
        method: 'POST',
        url: '/services/invoice/api/invoices',
        body: invoiceSample,
      }).then(({ body }) => {
        invoice = body;

        cy.authenticatedRequest({
          method: 'GET',
          url: `/services/invoice/api/invoices/${invoice.id}`,
        }).then(({ status, body: fetchedInvoice }) => {
          expect(status).to.equal(200);
          expect(fetchedInvoice.id).to.equal(invoice.id);
          expect(fetchedInvoice.code).to.equal('TEST-INVOICE-001');
        });
      });
    });

    it('should update an invoice via API', () => {
      cy.authenticatedRequest({
        method: 'POST',
        url: '/services/invoice/api/invoices',
        body: invoiceSample,
      }).then(({ body }) => {
        invoice = body;

        const updatedInvoice = {
          ...invoice,
          code: 'UPDATED-INVOICE-001',
          details: 'Updated invoice details',
          paymentAmount: 9999.99,
        };

        cy.authenticatedRequest({
          method: 'PUT',
          url: `/services/invoice/api/invoices/${invoice.id}`,
          body: updatedInvoice,
        }).then(({ status, body: updated }) => {
          expect(status).to.equal(200);
          expect(updated.code).to.equal('UPDATED-INVOICE-001');
          expect(updated.details).to.equal('Updated invoice details');
          expect(updated.paymentAmount).to.equal(9999.99);
        });
      });
    });

    it('should delete an invoice via API', () => {
      cy.authenticatedRequest({
        method: 'POST',
        url: '/services/invoice/api/invoices',
        body: invoiceSample,
      }).then(({ body }) => {
        const tempInvoice = body;

        cy.authenticatedRequest({
          method: 'DELETE',
          url: `/services/invoice/api/invoices/${tempInvoice.id}`,
        }).then(({ status }) => {
          expect(status).to.equal(204);
        });
      });
    });

    it('should filter invoices by status via API', () => {
      const paidInvoice = { ...invoiceSample, code: 'PAID-001', status: 'PAID' };
      const cancelledInvoice = { ...invoiceSample, code: 'CANCELLED-001', status: 'CANCELLED' };

      cy.authenticatedRequest({
        method: 'POST',
        url: '/services/invoice/api/invoices',
        body: paidInvoice,
      }).then(({ body: paid }) => {
        invoice = paid;

        cy.authenticatedRequest({
          method: 'POST',
          url: '/services/invoice/api/invoices',
          body: cancelledInvoice,
        }).then(({ body: cancelled }) => {
          cy.authenticatedRequest({
            method: 'GET',
            url: '/services/invoice/api/invoices?status.equals=PAID',
          }).then(({ status, body }) => {
            expect(status).to.equal(200);
            expect(body).to.be.an('array');
            const foundPaid = body.find((inv) => inv.id === paid.id);
            expect(foundPaid).to.exist;
            expect(foundPaid.status).to.equal('PAID');
          });

          cy.authenticatedRequest({
            method: 'DELETE',
            url: `/services/invoice/api/invoices/${cancelled.id}`,
          });
        });
      });
    });
  });
});
