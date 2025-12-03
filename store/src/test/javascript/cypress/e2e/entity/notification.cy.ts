describe('Notification e2e test', () => {
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const notificationSample = {
    date: '2025-11-30T05:36:26.485Z',
    details: 'Test notification details',
    sentDate: '2025-11-30T03:47:57.534Z',
    format: 'EMAIL',
    userId: 2,
    productId: 1,
  };

  let notification;

  beforeEach(() => {
    cy.login(username, password);
  });

  afterEach(() => {
    if (notification) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/services/notification/api/notifications/${notification.id}`,
      }).then(() => {
        notification = undefined;
      });
    }
  });

  it('should list notifications via API through gateway', () => {
    cy.authenticatedRequest({
      method: 'GET',
      url: '/services/notification/api/notifications',
    }).then(({ status, body }) => {
      expect(status).to.equal(200);
      expect(body).to.be.an('array');
    });
  });

  describe('Notification API operations through gateway', () => {
    it('should create a new notification via API', () => {
      cy.authenticatedRequest({
        method: 'POST',
        url: '/services/notification/api/notifications',
        body: notificationSample,
      }).then(({ status, body }) => {
        expect(status).to.equal(201);
        expect(body.format).to.equal('EMAIL');
        expect(body.details).to.equal('Test notification details');
        expect(body.userId).to.equal(2);
        expect(body.id).to.exist;
        notification = body;
      });
    });

    it('should get a specific notification via API', () => {
      cy.authenticatedRequest({
        method: 'POST',
        url: '/services/notification/api/notifications',
        body: notificationSample,
      }).then(({ body }) => {
        notification = body;

        cy.authenticatedRequest({
          method: 'GET',
          url: `/services/notification/api/notifications/${notification.id}`,
        }).then(({ status, body: fetchedNotification }) => {
          expect(status).to.equal(200);
          expect(fetchedNotification.id).to.equal(notification.id);
          expect(fetchedNotification.format).to.equal('EMAIL');
          expect(fetchedNotification.details).to.equal('Test notification details');
        });
      });
    });

    it('should update a notification via API', () => {
      cy.authenticatedRequest({
        method: 'POST',
        url: '/services/notification/api/notifications',
        body: notificationSample,
      }).then(({ body }) => {
        notification = body;

        const updatedNotification = {
          ...notification,
          details: 'Updated notification details',
          format: 'SMS',
        };

        cy.authenticatedRequest({
          method: 'PUT',
          url: `/services/notification/api/notifications/${notification.id}`,
          body: updatedNotification,
        }).then(({ status, body: updated }) => {
          expect(status).to.equal(200);
          expect(updated.details).to.equal('Updated notification details');
          expect(updated.format).to.equal('SMS');
        });
      });
    });

    it('should delete a notification via API', () => {
      cy.authenticatedRequest({
        method: 'POST',
        url: '/services/notification/api/notifications',
        body: notificationSample,
      }).then(({ body }) => {
        const tempNotification = body;

        cy.authenticatedRequest({
          method: 'DELETE',
          url: `/services/notification/api/notifications/${tempNotification.id}`,
        }).then(({ status }) => {
          expect(status).to.equal(204);
        });
      });
    });

    it('should filter notifications by format via API', () => {
      // Create notifications with different formats
      const emailNotification = { ...notificationSample, format: 'EMAIL' };
      const smsNotification = { ...notificationSample, format: 'SMS' };

      cy.authenticatedRequest({
        method: 'POST',
        url: '/services/notification/api/notifications',
        body: emailNotification,
      }).then(({ body: email }) => {
        notification = email;

        cy.authenticatedRequest({
          method: 'POST',
          url: '/services/notification/api/notifications',
          body: smsNotification,
        }).then(({ body: sms }) => {
          cy.authenticatedRequest({
            method: 'GET',
            url: '/services/notification/api/notifications?format.equals=EMAIL',
          }).then(({ status, body }) => {
            expect(status).to.equal(200);
            expect(body).to.be.an('array');
            const foundEmail = body.find((notif: any) => notif.id === email.id);
            expect(foundEmail).to.exist;
            expect(foundEmail.format).to.equal('EMAIL');
          });

          // Cleanup
          cy.authenticatedRequest({
            method: 'DELETE',
            url: `/services/notification/api/notifications/${sms.id}`,
          });
        });
      });
    });
  });
});
