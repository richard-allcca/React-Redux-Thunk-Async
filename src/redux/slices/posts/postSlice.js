import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { sub } from "date-fns";

const POST_URL = "https://jsonplaceholder.typicode.com/posts";

// Estado inicial del slice, que define cómo se verá el estado de los posts en el store
const initialState = {
    posts: [], // Arreglo para almacenar los posts
    status: "idle", // Estado de la solicitud: 'idle', 'loading', 'succeeded', 'failed'
    error: null, // Para almacenar errores en caso de que ocurran
};

// **Thunk asíncrono para obtener posts**
// `createAsyncThunk` genera automáticamente acciones para los estados 'pending', 'fulfilled' y 'rejected'
export const fetchPosts = createAsyncThunk("post/fetchPosts", async () => {
    const response = await axios.get(POST_URL);
    return response.data;
});

// **Thunk asíncrono para agregar un nuevo post**
// Este thunk realiza una solicitud POST para agregar un nuevo post y devuelve la respuesta
export const addNewPost = createAsyncThunk(
    "posts/addNewPost",
    async (initialPost) => {
        const response = await axios.post(POST_URL, initialPost);
        return response.data;
    }
);

// **Creación del slice de posts**
// Un slice combina el estado, los reducers y las acciones relacionadas con una funcionalidad específica
const postsSlice = createSlice({
    name: "posts", // Nombre del slice
    initialState, // Estado inicial definido anteriormente
    reducers: {
        // Reducer para manejar la adición de reacciones a un post
        reactionAdded: (state, action) => {
            const { postId, reaction } = action.payload; // Extraemos el ID del post y la reacción
            const existingPost = state.posts.find((post) => post.id === postId); // Buscamos el post correspondiente
            if (existingPost) {
                existingPost.reactions[reaction]++; // Incrementamos el contador de la reacción específica
            }
        },
    },
    // **Extra reducers para manejar acciones asíncronas**
    // Aquí se manejan los estados 'pending', 'fulfilled' y 'rejected' de los thunks
    extraReducers(builder) {
        builder
            // Caso cuando la solicitud para obtener posts está en progreso
            .addCase(fetchPosts.pending, (state, action) => {
                state.status = "loading"; // Cambiamos el estado a 'loading'
            })
            // Caso cuando la solicitud para obtener posts se completa con éxito
            .addCase(fetchPosts.fulfilled, (state, action) => {
                state.status = "succeeded"; // Cambiamos el estado a 'succeeded'

                let min = 1; // Variable para asignar fechas simuladas a los posts

                // Procesamos los posts obtenidos para agregarles propiedades adicionales
                const loadedPosts = action.payload.map((post) => {
                    post.date = sub(new Date(), { minutes: min++ }).toISOString(); // Asignamos una fecha simulada
                    post.reactions = {
                        thumbsUp: 0,
                        wow: 0,
                        heart: 0,
                        rocket: 0,
                        coffee: 0,
                    }; // Inicializamos las reacciones
                    return post;
                });

                // Concatenamos los nuevos posts al estado actual
                state.posts = state.posts.concat(loadedPosts);
            })
            // Caso cuando la solicitud para obtener posts falla
            .addCase(fetchPosts.rejected, (state, action) => {
                state.status = "failed"; // Cambiamos el estado a 'failed'
                state.error = action.error.message; // Guardamos el mensaje de error
            })
            // Caso cuando se agrega un nuevo post con éxito
            .addCase(addNewPost.fulfilled, (state, action) => {
                action.payload.userId = Number(action.payload.userId); // Aseguramos que el userId sea un número
                action.payload.date = new Date().toISOString(); // Asignamos la fecha actual
                action.payload.reactions = {
                    thumbsUp: 0,
                    wow: 0,
                    heart: 0,
                    rocket: 0,
                    coffee: 0,
                }; // Inicializamos las reacciones

                // Agregamos el nuevo post al estado
                state.posts.push(action.payload);
            });
    },
});

// **Selectores**
// Funciones para acceder a partes específicas del estado desde los componentes
export const selectAllPosts = (state) => state.posts.posts; // Devuelve todos los posts
export const getPostsStatus = (state) => state.posts.status; // Devuelve el estado de la solicitud
export const getPostsError = (state) => state.posts.error; // Devuelve el error, si existe

// Exportamos las acciones generadas automáticamente por el slice
export const { reactionAdded } = postsSlice.actions;

// Exportamos el reducer del slice para integrarlo en el store
export default postsSlice.reducer;
