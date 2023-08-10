describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
    const user = {
      username: 'Testuser',
      name: 'Tester',
      password: 'Test'
    }
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, user)
    cy.visit('')
  })

  it('Login form is shown', function() {
    cy.contains('Login')
    cy.contains('Username')
    cy.contains('Password')
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      // ...
      cy.get('#username').type('Testuser')
      cy.get('#password').type('Tet')
      cy.get('#loginButton').click()
      cy.contains('Logged in as Tester')
    })

    it('fails with wrong credentials', function() {
      // ...
      cy.get('#username').type('Testuser')
      cy.get('#password').type('Tes')
      cy.get('#loginButton').click()
      cy.get('.error').should('contain', 'Invalid username or password')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'Testuser', password: 'Test' })
    })

    it('A blog can be created', function() {
      cy.contains('New blog').click()

      cy.get('#title').type('Test title')
      cy.get('#author').type('Test author')
      cy.get('#url').type('Test url')
      cy.get('#create').click()
      cy.contains('Test title Test author')
    })
    it('Blog cant be created without title or author', function() {
      cy.contains('New blog').click()
      cy.get('#title').type('Test title')
      cy.get('#author').type('Test author')
      cy.get('#url').type('Test url')
      cy.get('#create').click()
      cy.contains('Test title Test author')

      cy.get('#author').type('Test author')
      cy.get('#url').type('Test url')
      cy.get('#create').click()
      cy.get('.error').should('contain', 'Title or author missing')
      cy.get('.blog').should('have.length', '1')
    })
    describe('Blog button test', function() {
      beforeEach(function() {
        cy.createBlog({ title: 'Test title', author: 'Test author', url: 'Test url' })
        cy.createBlog({ title: 'Test title', author: 'Test author', url: 'Test url' })
      })

      it('Can be liked', function() {
        cy.contains('View').click()
        cy.contains('Like').click()
        cy.contains('1')
      })

      it('Creator can delete their blog', function() {
        cy.get('.blog').should('have.length', '2')
        cy.contains('View').click()
        cy.contains('Remove').click()
        cy.get('.success').should('contain', 'Test title by Test author removed successfully!')
        cy.get('.blog').should('have.length', '1')
      })

      it('Creator only has remove button', function() {
        cy.contains('View').click()
        cy.contains('Remove')
        cy.get('#logout').click()
        const user = {
          username: 'Testuser2',
          name: 'Tester2',
          password: 'Test'
        }
        cy.request('POST', `${Cypress.env('BACKEND')}/users`, user)
        cy.login({ username: 'Testuser2', password: 'Test' })
        cy.contains('Logged in as Tester2')
        cy.contains('View').click()
        cy.contains('Remove').should('have.css', 'display', 'none')
      })
    })
  })
})