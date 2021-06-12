import axios from 'axios'
import { setAlert } from './alert'
import {DELETE_POST, ADD_POST, GET_POSTS,POST_ERROR, UPDATE_LIKES, GET_POST , ADD_COMMENT, REMOVE_COMMENT} from './types'

//Get Posts
export const getPosts = () => async dispatch => {
    try{
        const res = await axios.get('/api/posts')

        dispatch({
            type: GET_POSTS,
            payload: res.data
        })
    }
    catch(e){
        dispatch({
            type: POST_ERROR,
            payload: {msg: e.response.statusText, status: e.response.status}
        })
    }
}

// Add Like
export const addLike = id => async dispatch => {
    try{
        const res = await axios.put(`/api/posts/like/${id}`)
        dispatch({
            type: UPDATE_LIKES,
            payload: { id ,likes: res.data }
        })
    }
    catch(e){
        dispatch({
            type: POST_ERROR
        })
    }
}

// remove Like
export const removeLike = id => async dispatch => {
    try{
        const res = await axios.put(`/api/posts/unlike/${id}`)

        dispatch({
            type: UPDATE_LIKES,
            payload: { id ,likes: res.data }
        })
    }
    catch(e){
        dispatch({
            type: POST_ERROR
        })
    }
}

// delete post
export const deletePost = id => async dispatch => {
    try{
        const res = await axios.delete(`/api/posts/${id}`)

        dispatch({
            type: DELETE_POST,
            payload: id 
        })

        dispatch(setAlert('Post Removed', 'success'))
    }
    catch(e){
        dispatch({
            type: POST_ERROR
        })
    }
}

// add post
export const addPost = formData => async dispatch => {
    const config = {
        headers: {
            'Content_Type': 'application/json'
        }
    }
    try{
        const res = await axios.post(`/api/posts`, formData, config)

        dispatch({
            type: ADD_POST,
            payload: res.data
        })

        dispatch(setAlert('Post created', 'success'))
    }
    catch(e){
        dispatch({
            type: POST_ERROR
        })
    }
}

//Get Post
export const getPost = id => async dispatch => {
    try{
        const res = await axios.get(`/api/posts/${id}`)

        dispatch({
            type: GET_POST,
            payload: res.data
        })
    }
    catch(e){
        dispatch({
            type: POST_ERROR,
            payload: {msg: e.response.statusText, status: e.response.status}
        })
    }
}

// add comment
export const addComment = (postId, formData) => async dispatch => {
    const config = {
        headers: {
            'Content_Type': 'application/json'
        }
    }
    try{
        const res = await axios.post(`/api/posts/comment/${postId}`, formData, config)

        dispatch({
            type: ADD_COMMENT,
            payload: res.data
        })

        dispatch(setAlert('Comment Added', 'success'))
    }
    catch(e){
        dispatch({
            type: POST_ERROR
        })
    }
}

// add comment
export const deleteComment = (postId, commenId) => async dispatch => {
    try{
        const res = await axios.delete(`/api/posts/comment/${postId}/${commenId}`)

        dispatch({
            type: REMOVE_COMMENT,
            payload: commenId
        })

        dispatch(setAlert('Comment removed', 'success'))
    }
    catch(e){
        dispatch({
            type: POST_ERROR
        })
    }
}