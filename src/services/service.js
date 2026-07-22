import axios from 'axios'

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:9999'

const api = axios.create({
    baseURL: API_BASE_URL
})

// Users
export const loginUser = (email, password) =>
    api.get('/users', { params: { email, password } })

export const getUsersByEmail = (email) =>
    api.get('/users', { params: { email } })

export const getUsersByPhoneNumber = (phoneNumber) =>
    api.get('/users', { params: { phoneNumber } })

export const getUserById = (userId) =>
    api.get(`/users/${userId}`)

export const createUser = (userData) =>
    api.post('/users', userData)

export const updateUser = (userId, userData) =>
    api.patch(`/users/${userId}`, userData)

// Contacts
export const getContacts = (userId) =>
    api.get(`/contacts/${userId}`)

export const updateContacts = (userId, data) =>
    api.patch(`/contacts/${userId}`, { data })

export const createContacts = (userId) =>
    api.post('/contacts', { id: userId, data: [] })

// Trash
export const getTrash = (userId) =>
    api.get(`/trash/${userId}`)

export const updateTrash = (userId, data) =>
    api.patch(`/trash/${userId}`, { data })

export const createTrash = (userId) =>
    api.post('/trash', { id: userId, userId, data: [] })

// Groups
export const getGroups = () =>
    api.get('/groups')

// Shares
export const getPendingShares = (toUserId) =>
    api.get('/shares', { params: { toUserId, status: 'pending' } })

export const createShare = (shareData) =>
    api.post('/shares', shareData)

export const updateShare = (shareId, shareData) =>
    api.patch(`/shares/${shareId}`, shareData)
