import axios from 'axios';

const BASE_URL = 'http://localhost:8000';

function upload(formData) {
    const url = `${BASE_URL}/image`;
    return axios.post(url, formData)
        // get data
        .then(x => x.data)
        .then(x => JSON.parse(x))
        // add url field
}

export { upload }