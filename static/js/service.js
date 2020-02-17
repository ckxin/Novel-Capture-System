const axios = require('axios');

// export const service = axios.create({
//     url: "",
//     method: "GET",
//     timeout: 5000,
//     responseType: 'stream'
// });

export const service = axios.create({
    url: "",
    method: "GET",
    timeout: 8000,
    responseType: 'arraybuffer'
});

service.interceptors.response.use(null, err => {
    const { config, code } = err;
    if(code === 'ECONNABORTED') {
        console.log("TImeout!!");
        return new Promise(resolve => {
            setTimeout(async () => {
                resolve(await service(config));
            }, 2000);
        })
    }
});
