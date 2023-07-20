import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('Blogs tests', () => {
  let container
  beforeEach(() => {
    const blog = {
      title: 'Test title',
      author: 'Test',
      url: 'Test.com',
      user: {
        id: '4',
        name: 'Joe'
      }
    }

    container = render( <Blog  blog={blog} handleLike={() => {}} handleRemove={() => {}} user={{}} /> ).container
  })
  test('Only title and author is visible', () => {

    const element = screen.getByText('Test title Test')
    expect(element).toBeDefined()
    const div = container.querySelector('.togglable')
    expect(div).toHaveStyle('display: none')
  })

  test('Pressing button shows more', async () => {


    const user = userEvent.setup()
    const button = screen.getByText('View')

    await user.click(button)
    const open = container.querySelector('.togglable')
    expect(open).not.toHaveStyle('display: none')

    const closeButton = screen.getByText('Hide')
    await user.click(closeButton)
    const closed = container.querySelector('.togglable')
    expect(closed).toHaveStyle('display: none')
  })
})

test('Pressing like button twice', async () => {
  const blog = {
    title: 'Test title',
    author: 'Test',
    url: 'Test.com',
    user: {
      id: '4',
      name: 'Joe'
    }
  }
  const likeHandler = jest.fn()
  let container = render( <Blog  blog={blog} handleLike={likeHandler} handleRemove={() => {}} user={{}} /> ).container
  const user = userEvent.setup()
  const button = screen.getByText('View')


  await user.click(button)
  const open = container.querySelector('.togglable')
  expect(open).not.toHaveStyle('display: none')

  const likeBtn = screen.getByText('Like')
  await user.click(likeBtn)
  await user.click(likeBtn)
  expect(likeHandler.mock.calls).toHaveLenght
})