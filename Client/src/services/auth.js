import axios from "axios";

const instance = axios.create({
    baseURL : 'http://localhost:3000/api/infra'
});

instance.interceptors.request.use(function(config){
    const token = localStorage.getItem('token')

    config.headers.Authorization = `Bearer ${token}`

    if (config.data instanceof FormData) {
        config.headers['Content-Type'] = 'application/json';
    }

    return config;
}, function (error) {
    return Promise.reject(error);
});
instance.interceptors.response.use(function (response) {
    return response;
}, function (error) {
    console.log("Error occurred:", error);

    // Commented out server down handling
    // if (error.message === 'Network Error') {
    //     window.location.href = '/down';
    // }

    // Commented out login redirection
    // else if (error.response.status === 401) {
    //     localStorage.clear();
    //     window.location.href = '/login';
    // }

    return Promise.reject(error);
});

export default instance;