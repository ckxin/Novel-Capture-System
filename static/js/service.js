const axios = require('axios');

export const service = axios.create({
    url: "",
    method: "GET",
    timeout: 5000,
    responseType: 'stream'
});

// const service = axios.create({
//     url: "",
//     method: "GET",
//     timeout: 3000,
//     responseType: 'arraybuffer'
// });

service.interceptors.response.use(null, err => {
    const { config, code } = err;
    if(code === 'ECONNABORTED') {
        return new Promise(resolve => {
            setTimeout(async () => {
                resolve(await service(config));
            }, 2000);
        })
    }
});
